import { PrismaClient } from '@prisma/client'
import { hash, hashSync } from 'bcryptjs'
const prisma = new PrismaClient()

// async function main() {
//     // Seed User
//     const adminPassword = await hash('Azkal182', 10)
//     await prisma.user.createMany({
//         data: [
//             { username: 'admin', name: 'Admin User', password: adminPassword },
//             { username: 'teacher1', name: 'Teacher One', password: 'password1' },
//         ],
//     });

//     // Seed Asrama
//     // await prisma.asrama.create({
//     //     data: {
//     //         name: 'Asrama A',
//     //         classes: {
//     //             create: [
//     //                 {
//     //                     name: 'Kelas 1',
//     //                     teacher: 'Teacher One',
//     //                     students: {
//     //                         create: [
//     //                             { name: 'Student A1' },
//     //                             { name: 'Student A2' },
//     //                         ],
//     //                     },
//     //                 },
//     //                 {
//     //                     name: 'Kelas 2',
//     //                     teacher: 'Teacher Two',
//     //                     students: {
//     //                         create: [
//     //                             { name: 'Student B1' },
//     //                             { name: 'Student B2' },
//     //                         ],
//     //                     },
//     //                 },
//     //             ],
//     //         },
//     //     },
//     // });

//     // Seed Absensi
//     // const students = await prisma.siswa.findMany();
//     // for (const student of students) {
//     //     await prisma.absensi.create({
//     //         data: {
//     //             siswaId: student.id,
//     //             status: 'Hadir',
//     //         },
//     //     });
//     // }

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

// import { PrismaClient } from '@prisma/client'
// import bcrypt from 'bcryptjs'

// const prisma = new PrismaClient()

async function main() {
  // Hapus data sebelumnya dengan urutan yang benar
  // await prisma.$executeRawUnsafe(`TRUNCATE TABLE "JamAbsensi", "Absensi", "Siswa", "Kelas", "Asrama", "User" RESTART IDENTITY CASCADE`);

  await prisma.$transaction([
    // prisma.jamAbsensi.deleteMany(),
    // prisma.absensi.deleteMany(),
    // prisma.siswa.deleteMany(),
    // prisma.kelas.deleteMany(),
    // prisma.asrama.deleteMany(),
    prisma.user.deleteMany(),
  ])

  await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        name: 'Admin User',
        password: hashSync('Azkal182'),
        role: 'ADMIN',
      },
      {
        username: 'asrama',
        name: 'pasca User',
        password: hashSync('asrama123'),
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

// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// async function updateDataByRange() {
//     const updated = await prisma.siswa.updateMany({
//         where: {
//             id: {
//                 gte: 6048,  // ID mulai dari 100
//                 lte: 6158   // ID sampai 200
//             }
//         },
//         data: {
//             asramaId: 50
//         }
//     });

//     console.log(`${updated.count} records updated.`);
// }

// updateDataByRange()
//     .then(() => console.log('Update successful'))
//     .catch((e) => console.error(e))
//     .finally(async () => {
//         await prisma.$disconnect();
//     });

// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

// async function createPengurus() {
//   const data = [
//     { name: 'Dep. Sekretaris Pusat' },
//     { name: 'Dep. Amtsilati Store' },
//     { name: 'Dep. Pengawas Keuangan' },
//     { name: "Dep. Ta'lim Wal Ibadah" },
//     { name: 'Dep. Keamanan Pusat' },
//     { name: 'Badan Tashih' },
//     { name: 'Dep. Komite Disiplin' },
//     { name: 'Dep. Kesehatan Pusat' },
//     { name: 'Dep. IT & Pusat Data' },
//     { name: 'Dep. Amtsilati Media' },
//     { name: 'Dep. Akselerasi' },
//     { name: 'Badan Lajnah & Kaderisasi' },
//     { name: 'Dep. Budi Pekerti' },
//     { name: 'Dep. Pemuda & Olahraga' },
//     { name: 'Dep. Kebersihan' },
//     { name: 'Dep. Perlengkapan & Tata Ruang' },
//     { name: 'Dep. Bansus Amtsilati' },
//     { name: 'Dep. Logistik & Pangan' },
//     { name: 'Akasia' },
//     { name: 'Badan Thoriqoh' },
//     { name: 'Dep. Humas' },
//     { name: "Asrama An-Na'im" },
//     { name: 'Asrama Tasawwuf' },
//     { name: 'Asrama Illiyyin' },
//     { name: 'Asrama Takhossus' },
//     { name: 'Asrama Darussalam' },
//     { name: 'Asrama Darul Musthofa' },
//     { name: "Asrama Al-Ma'wa" },
//     { name: 'Dep. Pesanggrahan' },
//   ]

//   const updated = await prisma.pengurus.createMany({
//     data,
//   })

//   console.log(`${updated.count} records updated.`)
// }

// createPengurus()
//   .then(() => console.log('create pengurus successful'))
//   .catch((e) => console.error(e))
//   .finally(async () => {
//     await prisma.$disconnect()
//   })

// const createKelasBaru = async () => {
//   const data = [
//     { name: 'RAYHAN AZAM IRFAI', kelasId: 377, asramaId: 49 },
//     { name: 'MUHAMMAD BAGASKARA PRAMATA RAHAGI', kelasId: 377, asramaId: 49 },
//     { name: 'MUGHNI NUR IRHAM ARIFIN', kelasId: 377, asramaId: 49 },
//     { name: 'ILYU SURURIN', kelasId: 377, asramaId: 49 },
//     { name: 'IBRAHIM QODIR', kelasId: 377, asramaId: 49 },
//     { name: 'AFA AHMAD ZIDNA FAHMI', kelasId: 377, asramaId: 49 },
//     { name: 'MUHAMMAD CAESAR HARIS', kelasId: 377, asramaId: 49 },
//     { name: 'AHMAD FUAD HABIB', kelasId: 377, asramaId: 49 },
//     { name: 'MUSYAFA AL FIKAR', kelasId: 377, asramaId: 49 },
//     { name: 'ABYAN IBNU ZAHRAN', kelasId: 377, asramaId: 49 },
//     { name: 'FAISHAL RIZKY MUZZAKI', kelasId: 377, asramaId: 49 },
//     { name: 'ATTABIK AZIZI', kelasId: 377, asramaId: 49 },
//     { name: 'RACHMAT AKBARI', kelasId: 377, asramaId: 49 },
//     { name: 'MUHAMMAD EZIRA HAYYIM ALIE', kelasId: 377, asramaId: 49 },
//     {
//       name: "MUHAMMAD MUTABAHHIRUL ULUM AL MA'SHUM",
//       kelasId: 377,
//       asramaId: 49,
//     },
//     { name: 'MUHAMMAD REZKY MAULANA ALI', kelasId: 377, asramaId: 49 },
//     { name: 'ABDUL HASANI', kelasId: 377, asramaId: 49 },
//     { name: 'MUHAMMAD SHOFIH AFAFA', kelasId: 377, asramaId: 49 },
//     { name: 'MUHAMMAD IHSAN', kelasId: 377, asramaId: 49 },
//   ]
//   const updated = await prisma.siswa.createMany({
//     data,
//   })

//   console.log(`${updated.count} records updated.`)
// }

// createKelasBaru()
//   .then(() => console.log('create pengurus successful'))
//   .catch((e) => console.error(e))
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
