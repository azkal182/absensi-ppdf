'use server'

import prisma from '@/lib/prisma'

export async function tambahGuru(nama: string) {
  return await prisma.guru.create({
    data: {
      name: nama,
    },
  })
}

// Contoh penggunaan
// tambahGuru("Ust. Ahmad", "12345").then(console.log).catch(console.error);
export async function tambahJadwal(
  guruId: number,
  asramaId: number,
  hari: 'SENIN' | 'SELASA' | 'RABU',
  jamKe: number
) {
  // Cek apakah guru sudah mengajar di asrama ini
  let mengajar = await prisma.mengajar.findFirst({
    where: { guruId: guruId, asramaId: asramaId },
  })

  // Jika belum ada relasi guru-asrama, buat baru
  if (!mengajar) {
    mengajar = await prisma.mengajar.create({
      data: {
        guruId: guruId,
        asramaId: asramaId,
      },
    })
  }

  // Tambahkan jadwal
  return await prisma.jadwalPelajaran.create({
    data: {
      mengajarId: mengajar.id,
      hari,
      jamKe,
    },
  })
}

// Contoh penggunaan
//   tambahJadwal("guru-id-1", "asrama-id-1", "SENIN", 1).then(console.log).catch(console.error);
export async function rekapAbsensiGuruPerAsrama(
  asramaId: number,
  bulan: number,
  tahun: number
) {
  return await prisma.asrama.findUnique({
    where: { id: asramaId },
    select: {
      name: true,
      Mengajar: {
        select: {
          Guru: {
            select: { name: true },
          },
          jadwalPelajaran: {
            select: {
              hari: true,
              jamKe: true,
              absensiGuru: {
                where: {
                  tanggal: {
                    gte: new Date(tahun, bulan - 1, 1), // Awal bulan
                    lte: new Date(tahun, bulan, 0), // Akhir bulan
                  },
                },
                select: {
                  status: true,
                },
              },
            },
          },
        },
      },
    },
  })
}

// Contoh penggunaan
//   rekapAbsensiPerAsrama("asrama-id-1", 3, 2025).then(console.log).catch(console.error);
