import { ElectricityRecord, IElectricityRecord } from '../models/ElectricityRecord';
import { NotFoundError } from '../errors/AppError';

interface CreateElectricityDTO {
  groupId: string;
  recordedBy: string;
  previousUnits: number;
  currentUnits: number;
  ratePerUnit: number;
  fixedCharge: number;
  billingStart: Date;
  billingEnd: Date;
}

export class ElectricityService {
  async createRecord(dto: CreateElectricityDTO): Promise<IElectricityRecord> {
    const unitsConsumed = dto.currentUnits - dto.previousUnits;
    const totalAmount   = unitsConsumed * dto.ratePerUnit + dto.fixedCharge;

    return ElectricityRecord.create({
      ...dto,
      totalAmount: Math.round(totalAmount * 100) / 100,
    });
  }

  async getGroupRecords(groupId: string): Promise<IElectricityRecord[]> {
    return ElectricityRecord.find({ groupId })
      .populate('recordedBy', 'name email')
      .sort({ billingEnd: -1 });
  }
}
