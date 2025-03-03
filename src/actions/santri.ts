'use server'

import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import {
  CreateSantriInput,
  CreateSantriSchema,
  UpdateSantriInput,
} from '@/schemas/santriSchema'
// import { revalidatePath } from 'next/cache'

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
    pengurus: true
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
      pengurus: true,
    },
    orderBy: { id: 'asc' },
  })

  console.log(JSON.stringify(santri, null, 2))

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

export const getSantriByName = async (query: string, pengurus?: boolean) => {
  return await prisma.siswa.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
      ...(pengurus === true
        ? { pengurusId: { not: null } }
        : pengurus === false
          ? { pengurusId: null }
          : {}),
      kelasId: { not: null },
    },
    include: {
      asrama: true,
      kelas: true,
    },
    take: 20,
  })
}

export type SantriBulkUpdate = {
  id: number[]
  kelasId: number
  asramaId: number
}

export const pindahKelasBulk = async ({ data }: { data: SantriBulkUpdate }) => {
  try {
    const result = await prisma.siswa.updateMany({
      where: {
        id: {
          in: data.id,
        },
      },
      data: {
        asramaId: data.asramaId,
        kelasId: data.kelasId,
      },
    })

    return { message: 'success', data: result }
  } catch (error) {
    console.log(error)
    return { error: 'error updating user' }
  }
}
