import { z } from 'zod'

export const CreateSantriSchema = z.object({
  name: z.string().min(1, 'Nama tidak boleh kosong'),
  kelasId: z.number().int().positive().optional().nullable(),
  asramaId: z.number().int().positive().optional().nullable(),
})

export const UpdateSantriSchema = CreateSantriSchema.partial().extend({
  id: z.number().int().positive(),
})

export type CreateSantriInput = z.infer<typeof CreateSantriSchema>
export type UpdateSantriInput = z.infer<typeof UpdateSantriSchema>
