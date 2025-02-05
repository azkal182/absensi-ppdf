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
    console.log(asramaName)

    // await prisma.asrama.create({
    //     data: {
    //         name: asramaName
    //     }
    // });

    const kelasMap = new Map<
      string,
      {
        name: string
        teachers: { name: string; siswas: { name: string }[] }[]
      }
    >()

    for (const row of data) {
      const className = row['KELAS']?.toUpperCase() || 'UNKNOWN'
      const teacherName =
        typeof row['WALI KELAS'] === 'string'
          ? row['WALI KELAS'].toUpperCase()
          : row['WALI KELAS']
            ? row['WALI KELAS'].toString().toUpperCase()
            : null
      const studentName = row['NAMA']?.toUpperCase() || 'UNKNOWN'

      // Jika kelas belum ada di dalam map, buat baru
      if (!kelasMap.has(className)) {
        kelasMap.set(className, {
          name: className,
          teachers: [],
        })
      }

      const kelas = kelasMap.get(className)!

      // Cari guru yang sudah ada di dalam kelas ini
      let teacher = kelas.teachers.find((t) => t.name === teacherName)

      // Jika guru belum ada, tambahkan guru baru dengan daftar siswa kosong
      if (!teacher) {
        teacher = { name: teacherName, siswas: [] }
        kelas.teachers.push(teacher)
      }

      // Tambahkan siswa ke dalam guru yang sesuai
      teacher.siswas.push({ name: studentName })
    }
    const kelasList = Array.from(kelasMap.values())

    const datas = {
      name: asramaName,
      classes: {
        create: kelasList.flatMap((kelas) =>
          kelas.teachers.map((teacher) => ({
            name: kelas.name,
            teacher: teacher.name,
            Siswas: teacher.siswas?.length
              ? {
                  create: teacher.siswas.map((student) => ({
                    name: student.name.trim(),
                  })),
                }
              : undefined,
          }))
        ),
      },
    }

    await prisma.asrama.create({ data: datas })

    // console.log(asramaName);
  }

  return { message: 'Data imported successfully' }
}
