-- AlterTable
ALTER TABLE "siswa" ADD COLUMN     "pengurusId" INTEGER;

-- CreateTable
CREATE TABLE "Pengurus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Pengurus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_pengurusId_fkey" FOREIGN KEY ("pengurusId") REFERENCES "Pengurus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
