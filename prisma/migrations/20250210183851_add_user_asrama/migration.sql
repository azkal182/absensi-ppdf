-- CreateTable
CREATE TABLE "UserAsrama" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,

    CONSTRAINT "UserAsrama_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAsrama_userId_gradeId_key" ON "UserAsrama"("userId", "gradeId");

-- AddForeignKey
ALTER TABLE "UserAsrama" ADD CONSTRAINT "UserAsrama_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAsrama" ADD CONSTRAINT "UserAsrama_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "asrama"("id") ON DELETE CASCADE ON UPDATE CASCADE;
