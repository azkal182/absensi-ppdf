'use server'
import prisma from '@/lib/prisma'
import { DateTime } from 'luxon'

function getTodayWIBRangeUTC() {
  const todayWIB = DateTime.now().setZone('Asia/Jakarta')
  const startOfDayUTC = todayWIB.startOf('day').toUTC().toJSDate()
  const endOfDayUTC = todayWIB.endOf('day').toUTC().toJSDate()
  return { startOfDayUTC, endOfDayUTC }
}
export const getIzinAsrama = async () => {
  const { endOfDayUTC } = getTodayWIBRangeUTC()

  return await prisma.izin.findMany({
    where: {
      OR: [
        // izin hanya sehari
        // {
        //   startDate: backToUtc,
        //   onlyOneDay: true,
        //   uks: false,
        //   komdis: false,
        //   keamanan: false,
        // },
        {
          endDate: {
            gt: endOfDayUTC,
          },
          uks: false,
          komdis: false,
          keamanan: false,
        },
        // izin berlaku dengan tanggal selesai tidak ditentukan
        // {
        //     // startDate: new Date(),
        //     endDate: null,
        //     onlyOneDay: false
        // },
        // izin tanggal dengan range
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
