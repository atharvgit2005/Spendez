import { z } from 'zod';

export const RegisterDTO = z.object({
  name:     z.string().min(2).max(100),
  email:    z.string().email(),
  password: z.string().min(8).max(100),
});

export const LoginDTO = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export const RefreshTokenDTO = z.object({
  token: z.string().min(1),
});

export type RegisterDTOType = z.infer<typeof RegisterDTO>;
export type LoginDTOType    = z.infer<typeof LoginDTO>;
