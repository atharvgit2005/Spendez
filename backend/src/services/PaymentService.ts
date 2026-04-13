import { Types } from 'mongoose';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { IPayment } from '../models/Payment';
import { NotFoundError } from '../errors/AppError';
import { eventPublisher, Events } from '../events/EventPublisher';
import { simplifyDebts } from '../utils/debtSimplifier';
import { Split } from '../models/Split';

interface CreatePaymentDTO {
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency?: string;
  method?: IPayment['method'];
  referenceNote?: string;
}

export class PaymentService {
  private paymentRepo = new PaymentRepository();

  async createPayment(dto: CreatePaymentDTO): Promise<IPayment> {
    const payment = await this.paymentRepo.create({
      ...dto,
      groupId:    new Types.ObjectId(dto.groupId),
      fromUserId: new Types.ObjectId(dto.fromUserId),
      toUserId:   new Types.ObjectId(dto.toUserId),
      status:     'PENDING',
    });

    eventPublisher.emit(Events.PAYMENT_SETTLED, { payment });

    return payment;
  }

  async getGroupPayments(groupId: string): Promise<IPayment[]> {
    return this.paymentRepo.findByGroup(groupId);
  }

  async updateStatus(id: string, status: 'PENDING' | 'COMPLETED'): Promise<IPayment> {
    const payment = await this.paymentRepo.update(id, {
      status,
      ...(status === 'COMPLETED' ? { paidAt: new Date() } : {}),
    });
    if (!payment) throw new NotFoundError('Payment', id);
    return payment;
  }

  async getGroupBalances(groupId: string): Promise<{ userId: string; net: number }[]> {
    const gid = new Types.ObjectId(groupId);
    
    // Aggregation pipeline to calculate net balances including expenses and settlements
    const results = await Split.aggregate([
      // 1. Join with Expenses to filter by GroupId
      {
        $lookup: {
          from: 'expenses',
          localField: 'expenseId',
          foreignField: '_id',
          as: 'expense',
        },
      },
      { $unwind: '$expense' },
      { $match: { 'expense.groupId': gid } },

      // 2. Separate debts (what participants owe) and credits (what payers are owed)
      {
        $facet: {
          debts: [
            { $group: { _id: '$userId', totalDebt: { $sum: '$shareAmount' } } }
          ],
          credits: [
            { $group: { _id: '$expense.paidBy', totalCredit: { $sum: '$shareAmount' } } }
          ],
          paymentsOut: [
            {
              $lookup: {
                from: 'payments',
                pipeline: [
                  { $match: { groupId: gid, status: 'COMPLETED' } },
                  { $group: { _id: '$fromUserId', amount: { $sum: '$amount' } } }
                ],
                as: 'pOut'
              }
            },
            { $unwind: '$pOut' },
            { $group: { _id: '$pOut._id', totalPaid: { $first: '$pOut.amount' } } }
          ],
          paymentsIn: [
            {
              $lookup: {
                from: 'payments',
                pipeline: [
                  { $match: { groupId: gid, status: 'COMPLETED' } },
                  { $group: { _id: '$toUserId', amount: { $sum: '$amount' } } }
                ],
                as: 'pIn'
              }
            },
            { $unwind: '$pIn' },
            { $group: { _id: '$pIn._id', totalReceived: { $first: '$pIn.amount' } } }
          ]
        }
      }
    ]);

    const balanceMap: Record<string, number> = {};
    const f = results[0];
    
    // 1. Apply Debts (what you owe based on your share)
    f.debts.forEach((d: any) => {
      const uid = d._id.toString();
      balanceMap[uid] = (balanceMap[uid] || 0) - d.totalDebt;
    });
    
    // 2. Apply Credits (what people owe you because you paid for them)
    f.credits.forEach((c: any) => {
      const uid = c._id.toString();
      balanceMap[uid] = (balanceMap[uid] || 0) + c.totalCredit;
    });

    // 3. Apply Payments Out (money you sent to others - increases your balance as you owe less)
    f.paymentsOut?.forEach((p: any) => {
      const uid = p._id.toString();
      balanceMap[uid] = (balanceMap[uid] || 0) + p.totalPaid;
    });

    // 4. Apply Payments In (money you received - decreases your balance as they owe you less)
    f.paymentsIn?.forEach((p: any) => {
      const uid = p._id.toString();
      balanceMap[uid] = (balanceMap[uid] || 0) - p.totalReceived;
    });

    return Object.entries(balanceMap).map(([userId, net]) => ({ 
      userId, 
      net: Math.round(net * 100) / 100 
    }));
  }

  async getSimplifiedDebts(groupId: string) {
    const balances = await this.getGroupBalances(groupId);
    const rawDebts: { from: string; to: string; amount: number }[] = [];

    // Convert negative balances (debtors) into raw debts pointing to positive (creditors)
    const creditors = balances.filter((b) => b.net > 0);
    const debtors   = balances.filter((b) => b.net < 0);

    for (const debtor of debtors) {
      for (const creditor of creditors) {
        rawDebts.push({ from: debtor.userId, to: creditor.userId, amount: Math.abs(debtor.net) });
      }
    }

    return simplifyDebts(rawDebts);
  }
}
