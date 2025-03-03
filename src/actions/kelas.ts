'use server'
import prisma from '@/lib/prisma'
import {
  CreateKelasInput,
  CreateKelasSchema,
  UpdateKelasInput,
  UpdateKelasSchema,
} from '@/schemas/kelasSchema'
import { Prisma } from '@prisma/client'

export type KelasWithRelations = Prisma.KelasGetPayload<{
  include: {
    _count: true
    asrama: true
  }
}>

export const getKelas = async () => {
  const kelas = await prisma.kelas.findMany({
    include: {
      _count: true,
      asrama: true,
    },
  })
  return kelas
}

export const createKelas = async (data: CreateKelasInput) => {
  const validated = CreateKelasSchema.safeParse(data)
  if (!validated.success) {
    throw new Error('Invalid field')
  }
  try {
    const { name, teacher, asramaId } = validated.data
    const kelas = await prisma.kelas.create({
      data: {
        name: name.toUpperCase(),
        teacher: teacher.toUpperCase(),
        asramaId: asramaId,
      },
    })
    return { message: 'success', data: kelas }
  } catch (error) {
    console.log(error)
    return { error: 'error updating user' }
  }
}
export const updateKelas = async (data: UpdateKelasInput) => {
  const validated = UpdateKelasSchema.safeParse(data)
  if (!validated.success) {
    throw new Error('Invalid field')
  }
  const { id, asramaId, name, teacher } = validated.data
  const kelas = await prisma.kelas.update({
    where: {
      id: id,
    },
    data: {
      ...(name && { name: name.toUpperCase() }),
      ...(teacher && { teacher: teacher.toUpperCase() }),
      ...(asramaId && { asramaId }),
    },
  })
  return kelas
}
