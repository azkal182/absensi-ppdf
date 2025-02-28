-- AlterEnum
ALTER TYPE "IzinEnum" ADD VALUE 'IZIN';

-- AlterTable
ALTER TABLE "Izin" ADD COLUMN     "uks" BOOLEAN DEFAULT false;
