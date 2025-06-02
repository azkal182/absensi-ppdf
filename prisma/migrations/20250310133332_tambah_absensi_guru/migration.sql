-- CreateEnum
CREATE TYPE "dayOfWeek" AS ENUM ('SABTU', 'MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS');

-- CreateEnum
CREATE TYPE "statusKehadiranGuru" AS ENUM ('HADIR', 'IZIN', 'SAKIT', 'TELAT', 'ALFA');

-- CreateTable
CREATE TABLE "Guru" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mengajar" (
    "id" SERIAL NOT NULL,
    "guruId" INTEGER,
    "asramaId" INTEGER NOT NULL,

    CONSTRAINT "Mengajar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JadwalPelajaran" (
    "id" SERIAL NOT NULL,
    "mengajarId" INTEGER,
    "hari" "dayOfWeek" NOT NULL,
    "jamKe" INTEGER NOT NULL,

    CONSTRAINT "JadwalPelajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbsensiGuru" (
    "id" SERIAL NOT NULL,
    "jadwalPelajaranId" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "status" "statusKehadiranGuru" NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "AbsensiGuru_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mengajar" ADD CONSTRAINT "Mengajar_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mengajar" ADD CONSTRAINT "Mengajar_asramaId_fkey" FOREIGN KEY ("asramaId") REFERENCES "asrama"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalPelajaran" ADD CONSTRAINT "JadwalPelajaran_mengajarId_fkey" FOREIGN KEY ("mengajarId") REFERENCES "Mengajar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsensiGuru" ADD CONSTRAINT "AbsensiGuru_jadwalPelajaranId_fkey" FOREIGN KEY ("jadwalPelajaranId") REFERENCES "JadwalPelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
