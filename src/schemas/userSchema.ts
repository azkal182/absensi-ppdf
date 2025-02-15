import { RoleUser } from '@prisma/client'
import * as z from 'zod'

export const userSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(4),
  role: z.nativeEnum(RoleUser),
  roleId: z.coerce.number().min(1),
  asramaId: z.union([z.coerce.number().min(1), z.null()]), // Bisa angka atau null
})
export type UserSchema = z.infer<typeof userSchema>
