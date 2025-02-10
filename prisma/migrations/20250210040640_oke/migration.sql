/*
  Warnings:

  - You are about to drop the column `telegran` on the `report_whatsapp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "report_whatsapp" DROP COLUMN "telegran",
ADD COLUMN     "telegram" BOOLEAN NOT NULL DEFAULT false;
