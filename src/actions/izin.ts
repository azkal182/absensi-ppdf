/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type CreateIzinDto = {
  description: string
  jamKe?: number[]
  startDate?: Date
  endDate?: Date | null
  onlyOneDay: boolean
  izinStatus?: string
  siswaId?: number | null
  userId: number
  keamanan?: boolean
  uks?: boolean
  komdis?: boolean
}
function convertToJakartaTime(date: Date) {
  // Offset Jakarta dalam menit (UTC+7)
  const jakartaOffset = 7 * 60 * 60 * 1000 // 7 jam dalam milidetik
  return new Date(date.getTime() + jakartaOffset)
}

function setJakartaMidnight(date: Date) {
  // Ubah ke waktu Jakarta dulu
  const jakartaDate = convertToJakartaTime(date)

  // Ambil tahun, bulan, dan tanggal dari Jakarta Date
  const year = jakartaDate.getUTCFullYear()
  const month = jakartaDate.getUTCMonth()
  const day = jakartaDate.getUTCDate()

  // Buat tanggal baru dengan jam 00:00:00 WIB
  return new Date(Date.UTC(year, month, day, 0, 0, 0))
}

function convertJakartaToUTC(date: Date) {
  // Offset Jakarta dalam menit (UTC+7)
  const jakartaOffset = 7 * 60 * 60 * 1000 // 7 jam dalam milidetik
  return new Date(date.getTime() - jakartaOffset)
}

export const createIzin = async ({ data }: { data: CreateIzinDto }) => {
  const serverUtcDate = new Date() // Waktu di server (UTC)
  const jakartaMidnight = setJakartaMidnight(serverUtcDate) // Set ke 00:00:00 di Jakarta
  const backToUtc = convertJakartaToUTC(jakartaMidnight) // Kembalikan ke UTC

  console.log(serverUtcDate)
  console.log(jakartaMidnight)
  console.log(backToUtc)

  console.log({
    data: {
      description: data.description,
      jamKe: data.jamKe,
      startDate: backToUtc,
      onlyOneDay: data.onlyOneDay,
      izinStatus: data.izinStatus as any,
      siswaId: data.siswaId,
      userId: data.userId,
    },
  })

  try {
    const izin = await prisma.izin.create({
      data: {
        description: data.description,
        jamKe: data.jamKe,
        startDate: backToUtc,
        endDate: null,
        onlyOneDay: data.onlyOneDay,
        izinStatus: data.izinStatus as any,
        siswaId: data.siswaId,
        userId: Number(data.userId),
        keamanan: data.keamanan,
        uks: data.uks,
        komdis: data.komdis,
      },
    })
    revalidatePath('/izin-asrama')
    revalidatePath('/izin-keamanan')
    revalidatePath('/izin-kesehatan')
    revalidatePath('/izin-komdis')
    return { success: true, data: izin }
  } catch (error) {
    console.error('Error creating izin:', error)
    return { success: false, message: 'Failed to create izin' }
  }
}

export const getIzinKeamanan = async () => {
  return await prisma.izin.findMany({
    where: {
      OR: [
        {
          endDate: null,
          onlyOneDay: false,
          keamanan: true,
        },
      ],
    },
    include: {
      siswa: {
        include: {
          asrama: true,
          kelas: true,
        },
      },
    },
  })
}

export const updateIzinDepartemen = async (id: number) => {
  try {
    await prisma.izin.update({
      where: {
        id: id,
      },
      data: {
        endDate: new Date(),
      },
    })
    revalidatePath('/izin-keamanan')
    return { success: true }
  } catch (error) {
    return { success: false, message: 'Gagal update data.' }
  }
}

export const getIzinUks = async () => {
  return await prisma.izin.findMany({
    where: {
      OR: [
        {
          endDate: null,
          onlyOneDay: false,
          uks: true,
        },
      ],
    },
    include: {
      siswa: {
        include: {
          asrama: true,
          kelas: true,
        },
      },
    },
  })
}

export const getIzinKomdis = async () => {
  return await prisma.izin.findMany({
    where: {
      OR: [
        {
          endDate: null,
          onlyOneDay: false,
          komdis: true,
        },
      ],
    },
    include: {
      siswa: {
        include: {
          asrama: true,
          kelas: true,
        },
      },
    },
  })
}
