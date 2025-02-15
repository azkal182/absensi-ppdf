'use server'
import prisma from '@/lib/prisma'

export const getPengurus = async () => {
  return await prisma.pengurus.findMany()
}
