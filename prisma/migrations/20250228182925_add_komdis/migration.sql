/*
  Warnings:

  - Made the column `uks` on table `Izin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `komdis` on table `Izin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Izin" ADD COLUMN     "keamanan" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "uks" SET NOT NULL,
ALTER COLUMN "komdis" SET NOT NULL;
