-- CreateEnum
CREATE TYPE "IzinEnum" AS ENUM ('SAKIT', 'PULANG');

-- AlterTable
ALTER TABLE "Izin" ADD COLUMN     "izinStatus" "IzinEnum" NOT NULL DEFAULT 'SAKIT';

-- CreateIndex
CREATE INDEX "Izin_startDate_onlyOneDay_endDate_idx" ON "Izin"("startDate", "onlyOneDay", "endDate");
