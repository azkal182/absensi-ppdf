/*
  Warnings:

  - A unique constraint covering the columns `[name,asramaId,teacher]` on the table `kelas` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "kelas_name_asramaId_key";

-- CreateIndex
CREATE UNIQUE INDEX "kelas_name_asramaId_teacher_key" ON "kelas"("name", "asramaId", "teacher");
