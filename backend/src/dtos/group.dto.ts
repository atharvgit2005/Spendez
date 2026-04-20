import { z } from 'zod';

export const CreateGroupDTO = z.object({
  name:        z.string().min(2).max(100),
  type:        z.enum(['TRIP', 'HOSTEL', 'EVENT', 'OTHER']),
  description: z.string().max(500).optional(),
});

export const AddMemberDTO = z.object({
  userId: z.string().min(1),
});

export type CreateGroupDTOType = z.infer<typeof CreateGroupDTO>;
