/*
  Warnings:

  - The `status` column on the `absensi` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name,asramaId]` on the table `kelas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,kelasId]` on the table `siswa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kelasId` to the `absensi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `absensi` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleUser" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "StatusAbsen" AS ENUM ('HADIR', 'SAKIT', 'IZIN', 'ALFA');

-- AlterTable
ALTER TABLE "absensi" ADD COLUMN     "kelasId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "StatusAbsen" NOT NULL DEFAULT 'HADIR';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "RoleUser" DEFAULT 'USER';

-- CreateTable
CREATE TABLE "jam_absensi" (
    "id" SERIAL NOT NULL,
    "absensiId" INTEGER NOT NULL,
    "jamKe" INTEGER NOT NULL,
    "status" "StatusAbsen" NOT NULL DEFAULT 'HADIR',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jam_absensi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jam_absensi_date_idx" ON "jam_absensi"("date");

-- CreateIndex
CREATE INDEX "jam_absensi_jamKe_idx" ON "jam_absensi"("jamKe");

-- CreateIndex
CREATE INDEX "absensi_kelasId_date_idx" ON "absensi"("kelasId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "kelas_name_asramaId_key" ON "kelas"("name", "asramaId");

-- CreateIndex
CREATE INDEX "siswa_kelasId_idx" ON "siswa"("kelasId");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_name_kelasId_key" ON "siswa"("name", "kelasId");

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jam_absensi" ADD CONSTRAINT "jam_absensi_absensiId_fkey" FOREIGN KEY ("absensiId") REFERENCES "absensi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
