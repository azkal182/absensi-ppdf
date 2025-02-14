'use server'

import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import {
  CreateSantriInput,
  CreateSantriSchema,
  UpdateSantriInput,
} from '@/schemas/santriSchema'

export type SantriWithRelations = Prisma.SiswaGetPayload<{
  include: {
    kelas: {
      select: {
        name: true
        teacher: true
      }
    }
    asrama: {
      select: {
        name: true
      }
    }
  }
}>

export const getAllSantri = async (): Promise<SantriWithRelations[]> => {
  const santri: SantriWithRelations[] = await prisma?.siswa.findMany({
    include: {
      kelas: {
        select: {
          name: true,
          teacher: true,
        },
      },
      asrama: {
        select: {
          name: true,
        },
      },
    },
  })

  return santri
}

export const createSantri = async (data: CreateSantriInput) => {
  const validated = CreateSantriSchema.safeParse(data)

  if (!validated.success) {
    throw new Error('Invalid field')
  }

  try {
    const result = await prisma.siswa.create({
      data,
    })
    return { message: 'success', data: result }
  } catch (error) {
    console.log(error)
    return { error: 'error saving santri' }
  }
}

export const updateSantri = async (
  id: number,
  data: Partial<UpdateSantriInput>
) => {
  try {
    const result = await prisma.siswa.update({
      where: { id },
      data,
    })
    return { message: 'success', data: result }
  } catch (error) {
    console.log(error)
    return { error: 'error updating user' }
  }
}
