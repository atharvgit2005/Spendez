import { z } from 'zod';

export const SplitConfigDTO = z.object({
  participants: z.array(z.string()).min(1),
  percentages:  z.record(z.string(), z.number()).optional(),
  weights:      z.record(z.string(), z.number()).optional(),
  exactAmounts: z.record(z.string(), z.number()).optional(),
});

export type SplitConfigDTOType = z.infer<typeof SplitConfigDTO>;
