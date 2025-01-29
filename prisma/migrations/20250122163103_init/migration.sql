/*
  Warnings:

  - You are about to drop the column `userId` on the `absensi` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "absensi" DROP CONSTRAINT "absensi_userId_fkey";

-- AlterTable
ALTER TABLE "absensi" DROP COLUMN "userId";
