// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//     // Seed User
//     await prisma.user.createMany({
//         data: [
//             { username: 'admin', name: 'Admin User', password: 'admin123' },
//             { username: 'teacher1', name: 'Teacher One', password: 'password1' },
//         ],
//     });

//     // Seed Asrama
//     await prisma.asrama.create({
//         data: {
//             name: 'Asrama A',
//             classes: {
//                 create: [
//                     {
//                         name: 'Kelas 1',
//                         teacher: 'Teacher One',
//                         students: {
//                             create: [
//                                 { name: 'Student A1' },
//                                 { name: 'Student A2' },
//                             ],
//                         },
//                     },
//                     {
//                         name: 'Kelas 2',
//                         teacher: 'Teacher Two',
//                         students: {
//                             create: [
//                                 { name: 'Student B1' },
//                                 { name: 'Student B2' },
//                             ],
//                         },
//                     },
//                 ],
//             },
//         },
//     });

//     // Seed Absensi
//     const students = await prisma.siswa.findMany();
//     for (const student of students) {
//         await prisma.absensi.create({
//             data: {
//                 siswaId: student.id,
//                 status: 'Hadir',
//             },
//         });
//     }

//     console.log('Seeding completed');
// }

// main()
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Hapus data sebelumnya dengan urutan yang benar
  // await prisma.$executeRawUnsafe(`TRUNCATE TABLE "JamAbsensi", "Absensi", "Siswa", "Kelas", "Asrama", "User" RESTART IDENTITY CASCADE`);

  await prisma.$transaction([
    prisma.jamAbsensi.deleteMany(),
    prisma.absensi.deleteMany(),
    prisma.siswa.deleteMany(),
    prisma.kelas.deleteMany(),
    prisma.asrama.deleteMany(),
    prisma.user.deleteMany(),
  ])

  await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        name: 'Admin User',
        password: bcrypt.hashSync('Azkal182'),
        role: 'ADMIN',
      },
      {
        username: 'pasca',
        name: 'pasca User',
        password: bcrypt.hashSync('pasca'),
        role: 'ASRAMA',
      },
      {
        username: 'illiyyin',
        name: 'illiyyin User',
        password: bcrypt.hashSync('illiyyin123'),
        role: 'ASRAMA',
      },
      {
        username: 'darussalam',
        name: 'darussalam User',
        password: bcrypt.hashSync('darussalam123'),
        role: 'ASRAMA',
      },
      {
        username: 'darulmusthofa',
        name: 'darulmusthofa User',
        password: bcrypt.hashSync('darulmusthofa123'),
        role: 'ASRAMA',
      },
    ],
  })

  // List asrama dan kelas
  // const asramaList = [
  //   'Na’im',
  //   'Tassawuf',
  //   'Darussalam',
  //   'Illiyyin',
  //   'Ma’wa',
  //   'Takhosus',
  // ]
  // const kelasList = ['Thoharoh', 'Ubudiah', 'Mu’amalat', 'Munakahat']

  // Seed Asrama, Kelas, dan Siswa
  // for (let i = 0; i < asramaList.length; i++) {
  //   const asramaName = asramaList[i]
  //
  //   await prisma.asrama.create({
  //     data: {
  //       name: asramaName,
  //       classes: {
  //         create: kelasList.map((kelasName, index) => ({
  //           name: kelasName,
  //           teacher: `Ust ${String.fromCharCode(65 + index)}`, // Ust A, Ust B, ...
  //           students: {
  //             create: Array.from({ length: 10 }).map((_, studentIndex) => ({
  //               name: `Santri ${asramaName} ${kelasName} ${studentIndex + 1}`,
  //             })),
  //           },
  //         })),
  //       },
  //     },
  //   })
  // }

  // Seed Absensi
  // const students = await prisma.siswa.findMany();
  // for (const student of students) {
  //     await prisma.absensi.create({
  //         data: {
  //             siswaId: student.id,
  //             status: Math.random() > 0.1 ? 'Hadir' : 'Tidak Hadir', // 90% hadir
  //         },
  //     });
  // }

  // console.log('Seeding completed with customized asrama, classes, and students');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
