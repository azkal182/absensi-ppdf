/*
  Warnings:

  - Added the required column `asramaId` to the `absensi` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "absensi_kelasId_date_idx";

-- AlterTable
ALTER TABLE "absensi" ADD COLUMN     "asramaId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "absensi_kelasId_date_asramaId_idx" ON "absensi"("kelasId", "date", "asramaId");

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_asramaId_fkey" FOREIGN KEY ("asramaId") REFERENCES "asrama"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
