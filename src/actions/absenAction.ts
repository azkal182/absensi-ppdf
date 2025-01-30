'use server'

import { SelectedAttendance } from '@/app/(protected)/absensi/tableData'
import prisma from '@/lib/prisma'
import { StatusAbsen } from '@prisma/client'

export async function getAsrama() {
  try {
    const asrama = await prisma.asrama.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    return asrama
  } catch (error) {
    return []
  }
}

export async function getClassByAsramaId(asramaId: number) {
  try {
    const result = await prisma.kelas.findMany({
      where: {
        asramaId: asramaId,
      },
    })

    return result
  } catch (error) {
    return []
  }
}

// GET: Ambil data Asrama, Kelas, dan Siswa
export async function getDataByKelasId(kelasId: number) {
  try {
    const siswa = await prisma.siswa.findMany({
      where: {
        kelasId,
      },
    })

    return siswa
  } catch (error) {
    return []
  }
}

// POST: Simpan data absensi
// export async function saveData(dataAbsens: SelectedAttendance) {
//     try {
//         const { data, asramaId, kelasId } = dataAbsens
//         const result = await prisma.absensi.createMany({
//             data: data.map((item) => {
//                 return {
//                     siswaId: item.siswaId,
//                     userId: 1,
//                     status: item.status,
//                     date: Date.now()
//                 }
//             })
//         });

//         return result;
//     } catch (error) {
//         console.error(error);
//     }
// }

async function cekAbsensi(
  kelasId: number,
  tanggal: Date,
  jamKe: number
): Promise<boolean> {
  // Normalisasi tanggal agar hanya memeriksa bagian tanggal (tanpa jam)
  const tanggalAbsensi = new Date(tanggal)
  tanggalAbsensi.setHours(0, 0, 0, 0)

  const absensi = await prisma.jamAbsensi.findFirst({
    where: {
      jamKe: jamKe,
      date: tanggalAbsensi, // Ubah dari rentang gte-lte menjadi pencocokan langsung
      absensi: {
        kelasId: kelasId, // Pastikan hubungan ke kelasId benar
      },
    },
    select: { id: true },
  })

  return absensi !== null
}

export async function saveData(dataAbsens: SelectedAttendance, userId: number) {
  try {
    const { data, jamKe, date, kelasId } = dataAbsens

    if (!userId) {
      throw new Error('User ID tidak valid.')
    }
    console.log({ userId })

    const checkUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!checkUser) {
      throw new Error('User ID tidak ditemukan.')
    }

    if (!jamKe || !date || !kelasId) {
      throw new Error('data tidak valid.')
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Data absensi tidak boleh kosong.')
    }

    const tanggalAbsensi = new Date(date)
    tanggalAbsensi.setHours(0, 0, 0, 0) // Normalisasi ke format tanggal tanpa waktu

    console.log(tanggalAbsensi)

    const absensiIsReady = await cekAbsensi(kelasId, tanggalAbsensi, jamKe)
    console.log({ absensiIsReady })

    if (absensiIsReady) {
      return { success: false, message: 'jam Absensi hari ini sudah diisi' } // Kembalikan false bukan throw error
    }

    const validStatuses = Object.values(StatusAbsen)

    const transaksi = []

    for (const item of data) {
      if (!validStatuses.includes(item.status as StatusAbsen)) {
        throw new Error(`Status "${item.status}" tidak valid.`)
      }

      let absensi = await prisma.absensi.findFirst({
        where: {
          siswaId: item.siswaId,
          date: tanggalAbsensi,
        },
      })

      // Jika absensi belum ada, buat entri baru
      if (!absensi) {
        absensi = await prisma.absensi.create({
          data: {
            siswaId: item.siswaId,
            userId,
            kelasId: kelasId,
            status: item.status as StatusAbsen,
            date: tanggalAbsensi,
          },
        })
      }

      // Tambahkan data jam absensi ke dalam transaksi
      transaksi.push(
        prisma.jamAbsensi.create({
          data: {
            absensiId: absensi.id,
            jamKe: jamKe,
            status: item.status as StatusAbsen,
            date: tanggalAbsensi, // Waktu sekarang saat absensi dicatat
          },
        })
      )
    }

    // Jalankan semua transaksi secara bersamaan
    await prisma.$transaction(transaksi)

    return { success: true, count: transaksi.length }
  } catch (error) {
    console.error('Error saat menyimpan data absensi:', error)
    return { success: false, message: error.message }
  }
}

export async function cekAbsensiMultiJam(
  kelasId: number,
  tanggal: Date,
  jamKeList: number[]
): Promise<Record<number, boolean>> {
  // Normalisasi tanggal agar hanya mempertimbangkan hari tanpa jam
  const dateStart = new Date(tanggal)
  dateStart.setHours(0, 0, 0, 0)

  // Ambil semua data absensi berdasarkan kelas, tanggal, dan daftar jamKe
  const absensi = await prisma.jamAbsensi.findMany({
    where: {
      jamKe: { in: jamKeList },
      date: dateStart, // Pastikan pencarian sesuai dengan tanggal normalisasi
      absensi: {
        kelasId: kelasId, // Mengakses kelas langsung
      },
    },
    select: {
      jamKe: true,
    },
  })

  // Konversi hasil menjadi format yang diinginkan
  return jamKeList.reduce(
    (hasil, jam) => {
      hasil[jam] = absensi.some((entry) => entry.jamKe === jam)
      return hasil
    },
    {} as Record<number, boolean>
  )
}

export async function getDaftarAbsen(
  kelasId: number,
  year: number,
  month: number
) {
  try {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const absensiList = await prisma.absensi.findMany({
      where: {
        date: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
        siswa: {
          kelasId,
        },
      },
      include: {
        siswa: true,
        JamAbsensi: {
          select: {
            jamKe: true,
            status: true,
          },
          orderBy: { jamKe: 'asc' },
        },
      },
      orderBy: [{ siswaId: 'asc' }, { date: 'asc' }],
    })

    if (!absensiList || absensiList.length === 0) {
      return [] // Return array kosong jika tidak ada data
    }

    // Struktur data agar lebih mudah diolah
    const siswaMap = new Map()

    absensiList.forEach((absensi) => {
      const siswaId = absensi.siswa?.id ?? 0 // Pastikan siswa ada
      if (!siswaMap.has(siswaId)) {
        siswaMap.set(siswaId, {
          id: siswaId,
          name: absensi.siswa?.name ?? 'Unknown',
          absensi: {},
        })
      }

      const formattedDate = new Date(absensi.date).getDate()

      // Jika belum ada absensi untuk tanggal ini, buat objek kosong
      if (!siswaMap.get(siswaId).absensi[formattedDate]) {
        siswaMap.get(siswaId).absensi[formattedDate] = []
      }

      // Tambahkan semua jamKe yang tersedia untuk tanggal ini
      absensi.JamAbsensi.forEach((jam) => {
        siswaMap.get(siswaId).absensi[formattedDate].push({
          jamKe: jam.jamKe,
          status: jam.status,
        })
      })
    })

    return Array.from(siswaMap.values())
  } catch (error) {
    console.error('Error fetching absensi:', error)
    return { error: 'Terjadi kesalahan saat mengambil data absensi.' }
  }
}

export const getKelasById = async (kelasId: number) => {
  try {
    const result = await prisma.kelas.findUnique({ where: { id: kelasId } })
    return result
  } catch (error) {
    console.error('Error fetching kelas:', error)
    return { error: 'Terjadi kesalahan saat mengambil data kelas.' }
  }
}
