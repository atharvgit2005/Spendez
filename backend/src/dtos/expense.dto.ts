import { z } from 'zod';
import { Types } from 'mongoose';

export const CreateExpenseDTO = z.object({
  groupId:     z.string().refine(val => Types.ObjectId.isValid(val)).transform(val => new Types.ObjectId(val)),
  title:       z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  amount:      z.number().positive(),
  currency:    z.string().default('INR'),
  category:    z.enum(['FOOD', 'TRAVEL', 'UTILITIES', 'SHOPPING', 'ENTERTAINMENT', 'OTHER']).default('OTHER'),
  splitType:   z.enum(['EQUAL', 'EXACT', 'PERCENTAGE', 'WEIGHTED']),
  sourceType:  z.enum(['MANUAL', 'OCR']).optional().default('MANUAL'),
  expenseDate: z.string().optional().transform((s) => (s ? new Date(s) : new Date())),
});

export type CreateExpenseDTOType = z.infer<typeof CreateExpenseDTO>;
