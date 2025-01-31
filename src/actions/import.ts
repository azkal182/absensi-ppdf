'use server'
import * as XLSX from 'xlsx'
import prisma from '@/lib/prisma'

export const importData = async (workbook: any) => {
  // Loop melalui setiap sheet (asrama)
  for (const sheetName of workbook.SheetNames) {
    // console.log('importData', sheetName)
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
      // console.log('importData', row['KELAS'])
      const className: string = row['KELAS']
      const teacherName: string =
        typeof row['WALI KELAS'] === 'string'
          ? row['WALI KELAS']
          : row['WALI KELAS'].toString()
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

      console.log(
        `data ${asramaName} - ${className} - ${teacherName} ${studentName}`
      )

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

// export const importData = async (workbook: any) => {
//   for (const sheetName of workbook.SheetNames) {
//     console.log('importData', sheetName)
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
//     // Kumpulkan semua kelas dan siswa untuk batch insert
//     const kelasMap = new Map<
//       string,
//       { name: string; teacher: string; asramaId: string }
//     >()
//     const siswaBatch: { name: string; kelasId: string }[] = []
//
//     for (const row of data) {
//       const className = row['KELAS'].toUpperCase()
//       const teacherName =
//         typeof row['WALI KELAS'] === 'string'
//           ? row['WALI KELAS'].toUpperCase()
//           : row['WALI KELAS'].toString()
//       const studentName = row['NAMA'].toUpperCase()
//
//       console.log(teacherName)
//
//       // Tambahkan ke map untuk menghindari duplikasi kelas
//       const classKey = `${className}-${asrama.id}`
//       if (!kelasMap.has(classKey)) {
//         kelasMap.set(classKey, {
//           name: className,
//           teacher: teacherName,
//           asramaId: asrama.id,
//         })
//       }
//
//       siswaBatch.push({ name: studentName, kelasId: '' }) // kelasId akan diperbarui nanti
//     }
//
//     // Insert semua kelas secara bulk
//     const kelasData = Array.from(kelasMap.values())
//     await prisma.kelas.createMany({
//       data: kelasData,
//       skipDuplicates: true, // Hindari duplikasi
//     })
//
//     // Ambil semua kelas yang sudah ada untuk mendapatkan ID
//     const kelasList = await prisma.kelas.findMany({
//       where: { asramaId: asrama.id },
//       select: { id: true, name: true },
//     })
//
//     // Update kelasId pada siswaBatch
//     const kelasIdMap = new Map(kelasList.map((k) => [k.name, k.id]))
//     for (const siswa of siswaBatch) {
//       siswa.kelasId = kelasIdMap.get(siswa.name) || ''
//     }
//
//     // Filter siswa yang memiliki kelasId valid
//     const validSiswaBatch = siswaBatch.filter((s) => s.kelasId)
//
//     // Insert semua siswa secara bulk
//     if (validSiswaBatch.length > 0) {
//       await prisma.siswa.createMany({
//         data: validSiswaBatch,
//         skipDuplicates: true, // Hindari duplikasi
//       })
//     }
//   }
//
//   return { message: 'Data imported successfully' }
// }
