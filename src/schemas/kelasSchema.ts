import { z } from 'zod'

export const CreateKelasSchema = z.object({
  name: z.string().min(1, 'Nama tidak boleh kosong'),
  teacher: z.string().min(1, 'Nama pengajar tidak boleh kosong'),
  asramaId: z.number().int().positive(),
})

export const UpdateKelasSchema = CreateKelasSchema.partial().extend({
  id: z.number().int().positive(),
})

export type CreateKelasInput = z.infer<typeof CreateKelasSchema>
export type UpdateKelasInput = z.infer<typeof UpdateKelasSchema>
