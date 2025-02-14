-- DropForeignKey
ALTER TABLE "siswa" DROP CONSTRAINT "siswa_kelasId_fkey";

-- AlterTable
ALTER TABLE "siswa" ALTER COLUMN "kelasId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "kelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
