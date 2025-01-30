'use server'
import * as XLSX from 'xlsx'
import prisma from '@/lib/prisma'

export const importData = async (workbook: any) => {
  // Loop melalui setiap sheet (asrama)
  for (const sheetName of workbook.SheetNames) {
    const asramaName = sheetName
    const worksheet = workbook.Sheets[sheetName]
    const data: { [key: string]: any }[] = XLSX.utils.sheet_to_json(worksheet)

    // Cari atau buat asrama
    const asrama = await prisma.asrama.upsert({
      where: { name: asramaName },
      update: {},
      create: { name: asramaName },
    })

    // Loop melalui setiap baris data (kelas dan siswa)
    for (const row of data) {
      const className: string = row['KELAS']
      const teacherName: string = row['WALI KELAS']
      const studentName: string = row['NAMA']

      // Cari atau buat kelas, pastikan terhubung ke asrama
      const kelas = await prisma.kelas.upsert({
        where: {
          name_asramaId: {
            // Gunakan composite unique key
            name: className.toUpperCase(),
            asramaId: asrama.id,
          },
        },
        update: { teacher: teacherName.toUpperCase() },
        create: {
          name: className.toUpperCase(),
          teacher: teacherName.toUpperCase(),
          asrama: { connect: { id: asrama.id } }, // Hubungkan ke asrama
        },
      })

      // Cari atau buat siswa, pastikan terhubung ke kelas
      await prisma.siswa.upsert({
        where: {
          name_kelasId: {
            // Gunakan composite unique key
            name: studentName.toUpperCase(),
            kelasId: kelas.id,
          },
        },
        update: {},
        create: {
          name: studentName.toUpperCase(),
          kelas: { connect: { id: kelas.id } }, // Hubungkan ke kelas
        },
      })
    }
  }

  return { message: 'Data imported successfully' }
}
