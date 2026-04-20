import { IPaymentRepository } from '../interfaces/repositories/IPaymentRepository';
import { Payment, IPayment } from '../models/Payment';

export class PaymentRepository implements IPaymentRepository {
  async create(data: Partial<IPayment>): Promise<IPayment> {
    return Payment.create(data);
  }

  async findById(id: string): Promise<IPayment | null> {
    return Payment.findById(id)
      .populate('fromUserId', 'name email avatarUrl')
      .populate('toUserId', 'name email avatarUrl');
  }

  async findAll(filter: Record<string, unknown> = {}): Promise<IPayment[]> {
    return Payment.find(filter);
  }

  async findByGroup(groupId: string): Promise<IPayment[]> {
    return Payment.find({ groupId })
      .populate('fromUserId', 'name email avatarUrl')
      .populate('toUserId', 'name email avatarUrl')
      .sort({ createdAt: -1 });
  }

  async update(id: string, data: Partial<IPayment>): Promise<IPayment | null> {
    return Payment.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await Payment.findByIdAndDelete(id);
  }
}
