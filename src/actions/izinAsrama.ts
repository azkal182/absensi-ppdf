'use server'
import prisma from '@/lib/prisma'
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

export const getIzinAsrama = async () => {
  // Contoh penggunaan
  const serverUtcDate = new Date() // Waktu di server (UTC)
  const jakartaMidnight = setJakartaMidnight(serverUtcDate) // Set ke 00:00:00 di Jakarta
  const backToUtc = convertJakartaToUTC(jakartaMidnight) // Kembalikan ke UTC

  return await prisma.izin.findMany({
    where: {
      OR: [
        // izin hanya sehari
        {
          startDate: backToUtc,
          onlyOneDay: true,
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
