import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateSiswaAsrama() {
  const siswaList = await prisma.siswa.findMany({
    where: {
      asramaId: null,
    },
    include: {
      kelas: {
        select: {
          asramaId: true,
        },
      },
    },
  })

  for (const siswa of siswaList) {
    if (siswa.kelas?.asramaId) {
      await prisma.siswa.update({
        where: { id: siswa.id },
        data: { asramaId: siswa.kelas.asramaId },
      })
    }
  }

  console.log(`Berhasil mengupdate ${siswaList.length} siswa`)
}

updateSiswaAsrama()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
