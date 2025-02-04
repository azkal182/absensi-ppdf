'use server'
import * as XLSX from 'xlsx'
import prisma from '@/lib/prisma'

// export const importData = async (workbook: any) => {
//   // Loop melalui setiap sheet (asrama)
//   for (const sheetName of workbook.SheetNames) {
//     // console.log('importData', sheetName)
//     const asramaName = sheetName
//     const worksheet = workbook.Sheets[sheetName]
//     const data: { [key: string]: any }[] = XLSX.utils.sheet_to_json(worksheet)
//
//     // Cari atau buat asrama
//     const asrama = await prisma.asrama.upsert({
//       where: { name: asramaName },
//       update: {},
//       create: { name: asramaName },
//     })
//
//     // Loop melalui setiap baris data (kelas dan siswa)
//     for (const row of data) {
//       // console.log('importData', row['KELAS'])
//       const className: string = row['KELAS']
//       const teacherName: string =
//         typeof row['WALI KELAS'] === 'string'
//           ? row['WALI KELAS']
//           : row['WALI KELAS'].toString()
//       const studentName: string = row['NAMA']
//
//       // Cari atau buat kelas, pastikan terhubung ke asrama
//       const kelas = await prisma.kelas.upsert({
//         where: {
//           name_asramaId: {
//             // Gunakan composite unique key
//             name: className.toUpperCase(),
//             asramaId: asrama.id,
//           },
//         },
//         update: { teacher: teacherName.toUpperCase() },
//         create: {
//           name: className.toUpperCase(),
//           teacher: teacherName.toUpperCase(),
//           asrama: { connect: { id: asrama.id } }, // Hubungkan ke asrama
//         },
//       })
//
//       console.log(
//         `data ${asramaName} - ${className} - ${teacherName} ${studentName}`
//       )
//
//       // Cari atau buat siswa, pastikan terhubung ke kelas
//       await prisma.siswa.upsert({
//         where: {
//           name_kelasId: {
//             // Gunakan composite unique key
//             name: studentName.toUpperCase(),
//             kelasId: kelas.id,
//           },
//         },
//         update: {},
//         create: {
//           name: studentName.toUpperCase(),
//           kelas: { connect: { id: kelas.id } }, // Hubungkan ke kelas
//         },
//       })
//     }
//   }
//
//   return { message: 'Data imported successfully' }
// }

export const importData = async (workbook: any) => {
  for (const sheetName of workbook.SheetNames) {
    const asramaName = sheetName
    const worksheet = workbook.Sheets[sheetName]
    const data: { [key: string]: any }[] = XLSX.utils.sheet_to_json(worksheet)

    const kelasList: {
      name: string
      teacher: string
      students: { name: string }[]
    }[] = []

    for (const row of data) {
      const className: string = row['KELAS'].toUpperCase()
      const teacherName: string =
        typeof row['WALI KELAS'] === 'string'
          ? row['WALI KELAS'].toUpperCase()
          : row['WALI KELAS'].toString().toUpperCase()
      const studentName: string = row['NAMA'].toUpperCase()

      let kelas = kelasList.find((k) => k.name === className)
      if (!kelas) {
        kelas = { name: className, teacher: teacherName, students: [] }
        kelasList.push(kelas)
      }
      kelas.students.push({ name: studentName })
    }

    await prisma.asrama.create({
      data: {
        name: asramaName,
        classes: {
          create: kelasList.map((kelas) => ({
            name: kelas.name,
            teacher: kelas.teacher,
            students: { create: kelas.students },
          })),
        },
      },
    })
  }

  return { message: 'Data imported successfully' }
}
