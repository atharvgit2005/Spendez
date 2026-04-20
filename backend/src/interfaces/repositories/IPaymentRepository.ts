import { IPayment } from '../../models/Payment';

export interface IPaymentRepository {
  create(data: Partial<IPayment>): Promise<IPayment>;
  findById(id: string): Promise<IPayment | null>;
  findAll(filter?: Record<string, unknown>): Promise<IPayment[]>;
  findByGroup(groupId: string): Promise<IPayment[]>;
  update(id: string, data: Partial<IPayment>): Promise<IPayment | null>;
  delete(id: string): Promise<void>;
}
