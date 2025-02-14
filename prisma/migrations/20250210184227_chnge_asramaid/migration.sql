/*
  Warnings:

  - You are about to drop the column `gradeId` on the `UserAsrama` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,asramaId]` on the table `UserAsrama` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `asramaId` to the `UserAsrama` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserAsrama" DROP CONSTRAINT "UserAsrama_gradeId_fkey";

-- DropIndex
DROP INDEX "UserAsrama_userId_gradeId_key";

-- AlterTable
ALTER TABLE "UserAsrama" DROP COLUMN "gradeId",
ADD COLUMN     "asramaId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAsrama_userId_asramaId_key" ON "UserAsrama"("userId", "asramaId");

-- AddForeignKey
ALTER TABLE "UserAsrama" ADD CONSTRAINT "UserAsrama_asramaId_fkey" FOREIGN KEY ("asramaId") REFERENCES "asrama"("id") ON DELETE CASCADE ON UPDATE CASCADE;
