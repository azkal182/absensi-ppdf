-- AlterTable
ALTER TABLE "siswa" ADD COLUMN     "asramaId" INTEGER;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_asramaId_fkey" FOREIGN KEY ("asramaId") REFERENCES "asrama"("id") ON DELETE SET NULL ON UPDATE CASCADE;
