'use server'

import { SelectedAttendance } from '@/app/(protected)/absensi/tableData'
import prisma from '@/lib/prisma'
import { StatusAbsen } from '@prisma/client'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'
import { DateTime } from 'luxon'

// const TIMEZONE = process.env.NEXT_PUBLIC_TIMEZONE as string;

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
    console.log(error)
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return []
  }
}

// GET: Ambil data Asrama, Kelas, dan Siswa
export async function getDataByKelasId(kelasId: number) {
  const now = DateTime.now().setZone('Asia/Jakarta')

  const startOfDayUTC = now.startOf('day').toUTC().toJSDate()
  const endOfDayUTC = now.endOf('day').toUTC().toJSDate()

  console.log(startOfDayUTC, endOfDayUTC)

  try {
    const siswa = await prisma.siswa.findMany({
      where: {
        kelasId,
      },
      include: {
        izin: {
          where: {
            OR: [
              // izin hanya sehari
              {
                startDate: {
                  gte: startOfDayUTC,
                  lt: endOfDayUTC,
                },
                onlyOneDay: true,
              },
              // izin berlaku dengan tanggal selesai tidak ditentukan
              {
                //   startDate: new Date(),
                onlyOneDay: false,
                endDate: null,
              },
              // izin tanggal dengan range
            ],
          },
          orderBy: {
            startDate: 'desc',
          },
        },
      },
    })

    const formattedSiswaList = siswa.map((siswa) => ({
      ...siswa,
      izin:
        siswa.izin.length > 0
          ? (({
              id,
              description,
              jamKe,
              startDate,
              endDate,
              onlyOneDay,
              izinStatus,
            }) => ({
              id,
              description,
              jamKe,
              startDate,
              endDate,
              onlyOneDay,
              izinStatus,
            }))(siswa.izin[0]) // Ambil izin pertama
          : null, // Jika izin kosong, set null
    }))

    // console.log(JSON.stringify(formattedSiswaList, null, 2))
    // console.log(new Date())

    return formattedSiswaList
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const absensi = await prisma.jamAbsensi.findFirst({
    where: {
      jamKe: jamKe,
      date: tanggal, // Ubah dari rentang gte-lte menjadi pencocokan langsung
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
    const { data, jamKe, date, kelasId, asramaId } = dataAbsens

    if (!userId) {
      throw new Error('User ID tidak valid.')
    }

    const checkUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!checkUser) {
      throw new Error('User ID tidak ditemukan.')
    }

    if (!jamKe || !date || !kelasId || !asramaId) {
      throw new Error('data tidak valid.')
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Data absensi tidak boleh kosong.')
    }

    const tanggalAbsensi = new Date(date)
    tanggalAbsensi.setHours(0, 0, 0, 0)
    const jakartaDate = new Date(date)

    const jakartaDateWithTime = toZonedTime(jakartaDate, 'Asia/Jakarta') // Convert to Asia/Jakarta time
    jakartaDateWithTime.setHours(0, 0, 0, 0) // Set the time to 00:00

    // Step 2: Convert the Jakarta time to UTC and keep it as a Date object
    const utcDate = fromZonedTime(jakartaDateWithTime, 'Asia/Jakarta')

    // Step 3: You now have a Date object in UTC
    console.log('Asia/Jakarta Time:', jakartaDateWithTime)
    console.log('Converted UTC Date:', utcDate)

    const tanggalAbsensiUTC = fromZonedTime(tanggalAbsensi, 'Asia/Jakarta')
    console.log(tanggalAbsensiUTC)

    const absensiIsReady = await cekAbsensi(kelasId, utcDate, jamKe)

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
          date: utcDate,
        },
      })

      // Jika absensi belum ada, buat entri baru
      if (!absensi) {
        console.log('data baru')

        absensi = await prisma.absensi.create({
          data: {
            siswaId: item.siswaId,
            userId,
            asramaId,
            kelasId: kelasId,
            status: item.status as StatusAbsen,
            date: utcDate,
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
            date: utcDate, // Waktu sekarang saat absensi dicatat
          },
        })
      )
    }

    // Jalankan semua transaksi secara bersamaan
    await prisma.$transaction(transaksi)

    return { success: true, count: transaksi.length }
  } catch (error) {
    console.error('Error saat menyimpan data absensi:', error)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return { success: false, message: error.message }
  }
}

export const updateDataAbsen = async (dataAbsens: SelectedAttendance) => {
  console.log(dataAbsens)

  try {
    await Promise.all(
      dataAbsens.data?.map((item) =>
        prisma.jamAbsensi.update({
          where: {
            id: item.jamAbsensiId,
          },
          data: {
            status: item.status as any,
          },
        })
      )
    )
    return { success: true, messasge: 'Data Absensi berhasil di update' }
  } catch (error) {
    console.error('Error saat menyimpan data absensi:', error)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return { success: false, message: error.message }
  }
}

export async function cekAbsensiMultiJam(
  kelasId: number,
  tanggal: Date,
  jamKeList: number[]
): Promise<Record<number, boolean>> {
  // Normalisasi tanggal agar hanya mempertimbangkan hari tanpa jam
  const dateStart = fromZonedTime(tanggal, 'Asia/Jakarta')
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

export async function getAsramaWithFullData() {
  const data = await prisma.asrama.findMany({
    include: {
      _count: true,
      classes: {
        include: {
          _count: true,
        },
      },
    },
  })

  return data
}

export type Absensi = {
  asrama: string
  totalDays: number
  totalAbsensi: number
  HADIR: number
  SAKIT: number
  IZIN: number
  ALFA: number
  percent: Percent
}

export type Percent = {
  HADIR: string
  SAKIT: string
  IZIN: string
  ALFA: string
}

export async function getDaftarAbsen(
  kelasId: number,
  year: number,
  month: number
): Promise<Absensi[] | { error: string }> {
  try {
    // Awal bulan di zona WIB (1 Maret 2025 00:00 WIB)
    const startOfMonthWIB = new Date(year, month - 1, 1, 0, 0, 0)
    const startDateUTC = new Date(
      startOfMonthWIB.getTime() - 7 * 60 * 60 * 1000
    ) // Kurangi 7 jam

    // Akhir bulan di zona WIB (31 Maret 2025 23:59:59 WIB)
    const endOfMonthWIB = new Date(year, month, 0, 23, 59, 59)
    const endDateUTC = new Date(endOfMonthWIB.getTime() - 7 * 60 * 60 * 1000) // Kurangi 7 jam

    const absensiList = await prisma.absensi.findMany({
      where: {
        date: {
          gte: startDateUTC.toISOString(),
          lte: endDateUTC.toISOString(),
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
      return [] // Return empty array if no data is found
    }

    // Structure the data for easier processing
    const siswaMap = new Map()

    absensiList.forEach((absensi) => {
      const siswaId = absensi.siswa?.id ?? 0 // Ensure siswa exists
      if (!siswaMap.has(siswaId)) {
        siswaMap.set(siswaId, {
          id: siswaId,
          name: absensi.siswa?.name ?? 'Unknown',
          absensi: {},
        })
      }

      // Convert the UTC date to Asia/Jakarta timezone
      const jakartaDate = toZonedTime(absensi.date, 'Asia/Jakarta')
      const formattedDate = new Date(jakartaDate).getDate() // Extract the day

      // If no attendance for this date yet, initialize an empty object
      if (!siswaMap.get(siswaId).absensi[formattedDate]) {
        siswaMap.get(siswaId).absensi[formattedDate] = []
      }

      // Add all available jamKe for this date
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
export async function getDaftarAbsenByAsrama(
  asramaId: number,
  year: number,
  month: number
): Promise<Absensi[] | { error: string }> {
  try {
    // Awal bulan di zona WIB (1 Maret 2025 00:00 WIB)
    const startOfMonthWIB = new Date(year, month - 1, 1, 0, 0, 0)
    const startDateUTC = new Date(
      startOfMonthWIB.getTime() - 7 * 60 * 60 * 1000
    ) // Kurangi 7 jam

    // Akhir bulan di zona WIB (31 Maret 2025 23:59:59 WIB)
    const endOfMonthWIB = new Date(year, month, 0, 23, 59, 59)
    const endDateUTC = new Date(endOfMonthWIB.getTime() - 7 * 60 * 60 * 1000) // Kurangi 7 jam

    const absensiList = await prisma.absensi.findMany({
      where: {
        date: {
          gte: startDateUTC.toISOString(),
          lte: endDateUTC.toISOString(),
        },
        siswa: {
          asramaId,
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
      return [] // Return empty array if no data is found
    }

    // Structure the data for easier processing
    const siswaMap = new Map()

    absensiList.forEach((absensi) => {
      const siswaId = absensi.siswa?.id ?? 0 // Ensure siswa exists
      if (!siswaMap.has(siswaId)) {
        siswaMap.set(siswaId, {
          id: siswaId,
          name: absensi.siswa?.name ?? 'Unknown',
          absensi: {},
        })
      }

      // Convert the UTC date to Asia/Jakarta timezone
      const jakartaDate = toZonedTime(absensi.date, 'Asia/Jakarta')
      const formattedDate = new Date(jakartaDate).getDate() // Extract the day

      // If no attendance for this date yet, initialize an empty object
      if (!siswaMap.get(siswaId).absensi[formattedDate]) {
        siswaMap.get(siswaId).absensi[formattedDate] = []
      }

      // Add all available jamKe for this date
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

export async function getDaftarAbsenTodayByKelasId(
  kelasId: number
): Promise<Absensi[] | { error: string }> {
  try {
    const todayJakarta = toZonedTime(new Date(), 'Asia/Jakarta')

    // Set jam ke 00:00 di zona Jakarta
    todayJakarta.setHours(0, 0, 0, 0)

    // Konversi kembali ke UTC
    const todayUtc = fromZonedTime(todayJakarta, 'Asia/Jakarta')

    const absensiList = await prisma.absensi.findMany({
      where: {
        date: todayUtc.toISOString(),
        siswa: {
          kelasId,
        },
      },
      include: {
        siswa: true,
        JamAbsensi: {
          select: {
            id: true,
            jamKe: true,
            status: true,
          },
          orderBy: { jamKe: 'asc' },
        },
      },
      orderBy: [{ siswaId: 'asc' }, { date: 'asc' }],
    })

    if (!absensiList || absensiList.length === 0) {
      console.log('no data')

      return [] // Return empty array if no data is found
    }

    // Structure the data for easier processing
    const siswaMap = new Map()

    absensiList.forEach((absensi) => {
      const siswaId = absensi.siswa?.id ?? 0 // Ensure siswa exists
      if (!siswaMap.has(siswaId)) {
        siswaMap.set(siswaId, {
          id: siswaId,
          name: absensi.siswa?.name ?? 'Unknown',
          data: [],
        })
      }

      // Add all available jamKe for this date
      absensi.JamAbsensi.forEach((jam) => {
        siswaMap.get(siswaId).data.push({
          jamAbsensiId: jam.id,
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

export async function getDaftarAbsenByJamKe(
  kelasId: number,
  date: Date,
  jamKe: number
): Promise<Absensi[] | { error: string }> {
  try {
    const todayJakarta = toZonedTime(date, 'Asia/Jakarta')

    // Set jam ke 00:00 di zona Jakarta
    todayJakarta.setHours(0, 0, 0, 0)

    // Konversi kembali ke UTC
    const todayUtc = fromZonedTime(todayJakarta, 'Asia/Jakarta')

    const absensiList = await prisma.absensi.findMany({
      where: {
        date: todayUtc.toISOString(),
        siswa: {
          kelasId,
        },
        JamAbsensi: {
          some: {
            jamKe,
          },
        },
      },
      include: {
        siswa: true,
        JamAbsensi: {
          where: { jamKe },
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
      return []
    }

    const siswaMap = new Map()

    absensiList.forEach((absensi) => {
      const siswaId = absensi.siswa?.id ?? 0
      if (!siswaMap.has(siswaId)) {
        siswaMap.set(siswaId, {
          id: siswaId,
          name: absensi.siswa?.name ?? 'Unknown',
          status: absensi.JamAbsensi[0].status,
          // absensi: {},
        })
      }

      // const jakartaDate = toZonedTime(absensi.date, 'Asia/Jakarta');
      // const formattedDate = new Date(jakartaDate).getDate();

      // if (!siswaMap.get(siswaId).absensi[formattedDate]) {
      //     siswaMap.get(siswaId).absensi[formattedDate] = [];
      // }

      // absensi.JamAbsensi.forEach((jam) => {
      //     siswaMap.get(siswaId).absensi[formattedDate].push({
      //         jamKe: jam.jamKe,
      //         status: jam.status,
      //     });
      // });
    })
    console.log(JSON.stringify(Array.from(siswaMap.values()), null, 2))

    return Array.from(siswaMap.values())
  } catch (error) {
    console.error('Error fetching absensi by jamKe:', error)
    return {
      error: 'Terjadi kesalahan saat mengambil data absensi berdasarkan jamKe.',
    }
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

export async function getChartThisMonth() {
  try {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const absensiByAsrama = await prisma.asrama.findMany({
      include: {
        Absensi: {
          where: {
            date: {
              gte: startDate.toISOString(),
              lte: endDate.toISOString(),
            },
          },
          select: {
            status: true,
            date: true,
          },
        },
      },
    })

    const formattedResult = absensiByAsrama.map((asrama) => {
      const statusCount = asrama.Absensi.reduce(
        (acc, absen) => {
          acc[absen.status] = (acc[absen.status] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )

      const totalAbsensi = asrama.Absensi.length
      // Menghitung total hari unik dalam pengabsenan
      const uniqueDates = new Set(
        asrama.Absensi.map(
          (absen) => new Date(absen.date).toISOString().split('T')[0]
        )
      )
      const totalDays = uniqueDates.size // Jumlah tanggal unik

      // Jika totalAbsensi = 0, anggap semua 100% HADIR
      const percent =
        totalAbsensi === 0
          ? { HADIR: '100%', SAKIT: '0%', IZIN: '0%', ALFA: '0%' }
          : {
              HADIR:
                (((statusCount.HADIR || 0) / totalAbsensi) * 100).toFixed(2) +
                '%',
              SAKIT:
                (((statusCount.SAKIT || 0) / totalAbsensi) * 100).toFixed(2) +
                '%',
              IZIN:
                (((statusCount.IZIN || 0) / totalAbsensi) * 100).toFixed(2) +
                '%',
              ALFA:
                (((statusCount.ALFA || 0) / totalAbsensi) * 100).toFixed(2) +
                '%',
            }

      return {
        asrama: asrama.name,
        totalDays,
        totalAbsensi,
        HADIR: statusCount.HADIR || 0,
        SAKIT: statusCount.SAKIT || 0,
        IZIN: statusCount.IZIN || 0,
        ALFA: statusCount.ALFA || 0,
        percent,
      }
    })

    return formattedResult
  } catch (error) {
    console.error('Error fetching absensi:', error)
    // return { error: 'Terjadi kesalahan saat mengambil data absensi.' }
    return []
  }
}

// export async function getDaftarAlfa() {
//     try {
//         const today = toZonedTime(new Date(), 'Asia/Jakarta') // Convert to Asia/Jakarta time
//         console.log(today);

//         const date = format(today, "yyyy-MM-dd'T'17:00:00.000'Z'");
//         console.log(date);

//         const absensiAlfa = await prisma.absensi.findMany({
//             where: {
//                 date: '2025-02-07T17:00:00.000Z',
//                 OR: [
//                     { status: 'ALFA' },
//                     {
//                         JamAbsensi: {
//                             some: { status: 'ALFA' },
//                         },
//                     },
//                 ],
//             },
//             include: {
//                 siswa: true,

//                 JamAbsensi: {
//                     select: {
//                         jamKe: true,
//                         status: true,
//                         date: true,
//                     },
//                     orderBy: { jamKe: 'asc' },
//                 },
//             },
//             orderBy: [{ siswaId: 'asc' }, { date: 'asc' }],
//         })

//         if (!absensiAlfa || absensiAlfa.length === 0) {
//             return []
//         }

//         const siswaMap = new Map()

//         absensiAlfa.forEach((absensi) => {
//             const siswaId = absensi.siswa?.id ?? 0
//             if (!siswaMap.has(siswaId)) {
//                 siswaMap.set(siswaId, {
//                     id: siswaId,
//                     name: absensi.siswa?.name ?? 'Unknown',
//                     alfa: [],
//                 })
//             }

//             const formattedDate = new Date(absensi.date).toISOString().split('T')[0]
//             const existingEntry = siswaMap
//                 .get(siswaId)
//                 .alfa.find((entry: any) => entry.date === formattedDate)

//             if (existingEntry) {
//                 existingEntry.jamKe.push(...absensi.JamAbsensi.map((jam) => jam.jamKe))
//             } else {
//                 siswaMap.get(siswaId).alfa.push({
//                     date: formattedDate,
//                     jamKe: absensi.JamAbsensi.map((jam) => jam.jamKe),
//                     status: 'ALFA',
//                 })
//             }
//         })

//         return Array.from(siswaMap.values())
//     } catch (error) {
//         console.error('Error fetching absensi ALFA:', error)
//         return { error: 'Terjadi kesalahan saat mengambil data absensi ALFA.' }
//     }
// }

// export async function getDaftarAlfa() {
//     try {
//         // Ambil waktu saat ini dan ubah ke zona Asia/Jakarta
//         const todayJakarta = toZonedTime(new Date(), 'Asia/Jakarta')

//         // Set jam ke 00:00 di zona Jakarta
//         todayJakarta.setHours(0, 0, 0, 0)

//         // Konversi kembali ke UTC
//         const todayUtc = fromZonedTime(todayJakarta, 'Asia/Jakarta')

//         const absensiAlfa = await prisma.absensi.findMany({
//             where: {
//                 date: todayUtc.toISOString(),
//                 OR: [
//                     { status: 'ALFA' },
//                     {
//                         JamAbsensi: {
//                             some: { status: 'ALFA' },
//                         },
//                     },
//                 ],
//             },
//             include: {
//                 siswa: {
//                     include: {
//                         pengurus: true,
//                     },
//                 },
//                 asrama: true,
//                 kelas: true,
//                 JamAbsensi: {
//                     select: {
//                         jamKe: true,
//                         status: true,
//                         date: true,
//                     },
//                     orderBy: { jamKe: 'asc' },
//                 },
//             },
//             orderBy: [{ asramaId: 'asc' }, { siswaId: 'asc' }, { date: 'asc' }],
//         })

//         if (!absensiAlfa || absensiAlfa.length === 0) {
//             return []
//         }
//         // console.log(JSON.stringify(absensiAlfa, nulln2));

//         const asramaMap = new Map()

//         absensiAlfa.forEach((absensi) => {
//             const asramaId = absensi.asrama?.id ?? 0
//             const asramaName = absensi.asrama?.name ?? 'Unknown'
//             const kelasId = absensi.kelas?.id ?? 0
//             const kelasName = absensi.kelas?.name ?? 'Unknown'
//             const teacherName = absensi.kelas?.teacher ?? 'Unknown'
//             const isPengurus = !!absensi.siswa?.pengurus // Pastikan boolean

//             if (!asramaMap.has(asramaId)) {
//                 asramaMap.set(asramaId, {
//                     id: asramaId,
//                     name: asramaName,
//                     jumlahAlfa: 0,
//                     jumlahAlfaPengurus: 0,
//                     jumlahAlfaSantri: 0,
//                     kelas: new Map(),
//                 })
//             }

//             const asramaData = asramaMap.get(asramaId)

//             if (!asramaData.kelas.has(kelasId)) {
//                 asramaData.kelas.set(kelasId, {
//                     id: kelasId,
//                     name: kelasName,
//                     teacher: teacherName,
//                     siswa: [],
//                 })
//             }

//             const kelasData = asramaData.kelas.get(kelasId)

//             const siswaId = absensi.siswa?.id ?? 0
//             if (!kelasData.siswa.some((s: any) => s.id === siswaId)) {
//                 kelasData.siswa.push({
//                     id: siswaId,
//                     name: absensi.siswa?.name ?? 'Unknown',
//                     pengurusName: absensi.siswa.pengurus?.name ?? null,
//                     alfa: [],
//                 })
//             }

//             const siswaData = kelasData.siswa.find((s: any) => s.id === siswaId)

//             const formattedDate = new Date(absensi.date).toISOString().split('T')[0]
//             const existingEntry = siswaData.alfa.find(
//                 (entry: any) => entry.date === formattedDate
//             )

//             const jamAbsensiAlfa = absensi.JamAbsensi.filter(
//                 (jam) => jam.status === 'ALFA'
//             ).map((jam) => jam.jamKe)

//             if (existingEntry) {
//                 existingEntry.jamKe.push(...jamAbsensiAlfa)
//             } else {
//                 siswaData.alfa.push({
//                     date: formattedDate,
//                     jamKe: jamAbsensiAlfa,
//                     status: 'ALFA',
//                 })
//             }

//             if (isPengurus) {
//                 asramaData.jumlahAlfaPengurus += 1
//             } else {
//                 asramaData.jumlahAlfaSantri += 1
//             }
//             asramaData.jumlahAlfa += 1
//         })

//         // Konversi Map ke Array
//         const result = Array.from(asramaMap.values()).map((asrama) => ({
//             ...asrama,
//             kelas: Array.from(asrama.kelas.values()),
//         }))
//         console.log(JSON.stringify(result, null, 2));

//         // return result
//     } catch (error) {
//         console.error('Error fetching absensi ALFA:', error)
//         return { error: 'Terjadi kesalahan saat mengambil data absensi ALFA.' }
//     }
// }
export async function getDaftarAlfa(date?: Date) {
  try {
    // Ambil waktu saat ini dan ubah ke zona Asia/Jakarta
    const todayJakarta = toZonedTime(
      date ? new Date(date) : new Date(),
      'Asia/Jakarta'
    )

    // Kurangi 2 hari dari hari ini
    // todayJakarta.setDate(todayJakarta.getDate() - 1)

    // Set jam ke 00:00 di zona Jakarta
    todayJakarta.setHours(0, 0, 0, 0)

    // Konversi kembali ke UTC
    const todayUtc = fromZonedTime(todayJakarta, 'Asia/Jakarta')

    const absensiAlfa = await prisma.absensi.findMany({
      where: {
        date: todayUtc.toISOString(),
        OR: [
          { status: 'ALFA' },
          {
            JamAbsensi: {
              some: { status: 'ALFA' },
            },
          },
        ],
      },
      include: {
        siswa: {
          include: {
            pengurus: true,
          },
        },
        asrama: true,
        kelas: true,
        JamAbsensi: {
          select: {
            jamKe: true,
            status: true,
            date: true,
          },
          orderBy: { jamKe: 'asc' },
        },
      },
      orderBy: [{ asramaId: 'asc' }, { siswaId: 'asc' }, { date: 'asc' }],
    })

    if (!absensiAlfa || absensiAlfa.length === 0) {
      return []
    }

    const asramaMap = new Map()

    absensiAlfa.forEach((absensi) => {
      const asramaId = absensi.asrama?.id ?? 0
      const asramaName = absensi.asrama?.name ?? 'Unknown'
      const kelasId = absensi.kelas?.id ?? 0
      const kelasName = absensi.kelas?.name ?? 'Unknown'
      const teacherName = absensi.kelas?.teacher ?? 'Unknown'
      const isPengurus = !!absensi.siswa?.pengurus // Pastikan boolean

      if (!asramaMap.has(asramaId)) {
        asramaMap.set(asramaId, {
          id: asramaId,
          name: asramaName,
          jumlahAlfa: 0,
          jumlahAlfaPengurus: 0,
          jumlahAlfaSantri: 0,
          kelas: new Map(),
        })
      }

      const asramaData = asramaMap.get(asramaId)

      if (!asramaData.kelas.has(kelasId)) {
        asramaData.kelas.set(kelasId, {
          id: kelasId,
          name: kelasName,
          teacher: teacherName,
          siswa: [],
        })
      }

      const kelasData = asramaData.kelas.get(kelasId)

      const siswaId = absensi.siswa?.id ?? 0
      if (!kelasData.siswa.some((s: any) => s.id === siswaId)) {
        kelasData.siswa.push({
          id: siswaId,
          name: absensi.siswa?.name ?? 'Unknown',
          pengurusName: absensi.siswa.pengurus?.name ?? null,
          alfa: [],
        })
      }

      const siswaData = kelasData.siswa.find((s: any) => s.id === siswaId)

      const formattedDate = new Date(absensi.date).toISOString().split('T')[0]
      const existingEntry = siswaData.alfa.find(
        (entry: any) => entry.date === formattedDate
      )

      const jamAbsensiAlfa = absensi.JamAbsensi.filter(
        (jam) => jam.status === 'ALFA'
      ).map((jam) => jam.jamKe)

      if (jamAbsensiAlfa.length > 0) {
        if (existingEntry) {
          existingEntry.jamKe.push(...jamAbsensiAlfa)
        } else {
          siswaData.alfa.push({
            date: formattedDate,
            jamKe: jamAbsensiAlfa,
            status: 'ALFA',
          })
        }
      }

      if (siswaData.alfa.length === 0) {
        kelasData.siswa = kelasData.siswa.filter((s: any) => s.id !== siswaId)
      }

      if (siswaData.alfa.length > 0) {
        if (isPengurus) {
          asramaData.jumlahAlfaPengurus += 1
        } else {
          asramaData.jumlahAlfaSantri += 1
        }
        asramaData.jumlahAlfa += 1
      }
    })

    // Konversi Map ke Array
    const result = Array.from(asramaMap.values()).map((asrama) => ({
      ...asrama,
      kelas: Array.from(asrama.kelas.values()).map((kelas: any) => ({
        ...kelas,
        siswa: kelas.siswa.filter((s: any) => s.alfa.length > 0),
      })),
    }))

    // console.log(JSON.stringify(result))

    return result
  } catch (error) {
    console.error('Error fetching absensi ALFA:', error)
    return { error: 'Terjadi kesalahan saat mengambil data absensi ALFA.' }
  }
}

export async function getLaporanKeamanan(): Promise<
  Absensi[] | { error: string }
> {
  try {
    // Awal bulan di zona WIB (1 Maret 2025 00:00 WIB)
    const startOfMonthWIB = new Date(2025, 2, 1, 0, 0, 0)
    const startDateUTC = new Date(
      startOfMonthWIB.getTime() - 7 * 60 * 60 * 1000
    ) // Kurangi 7 jam

    // Akhir bulan di zona WIB (31 Maret 2025 23:59:59 WIB)
    const endOfMonthWIB = new Date(2025, 3, 0, 23, 59, 59)
    const endDateUTC = new Date(endOfMonthWIB.getTime() - 7 * 60 * 60 * 1000) // Kurangi 7 jam

    const absensiList = await prisma.absensi.findMany({
      where: {
        date: {
          gte: startDateUTC.toISOString(),
          lte: endDateUTC.toISOString(),
        },
        siswa: {
          kelasId: 363,
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
      return [] // Return empty array if no data is found
    }

    // Structure the data for easier processing
    const siswaMap = new Map()

    absensiList.forEach((absensi) => {
      const siswaId = absensi.siswa?.id ?? 0 // Ensure siswa exists
      if (!siswaMap.has(siswaId)) {
        siswaMap.set(siswaId, {
          id: siswaId,
          name: absensi.siswa?.name ?? 'Unknown',
          absensi: {},
        })
      }

      // Convert the UTC date to Asia/Jakarta timezone
      const jakartaDate = toZonedTime(absensi.date, 'Asia/Jakarta')
      const formattedDate = new Date(jakartaDate).getDate() // Extract the day

      // If no attendance for this date yet, initialize an empty object
      if (!siswaMap.get(siswaId).absensi[formattedDate]) {
        siswaMap.get(siswaId).absensi[formattedDate] = []
      }

      // Add all available jamKe for this date
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
