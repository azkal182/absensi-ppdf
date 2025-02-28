-- CreateTable
CREATE TABLE "Izin" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "jamKe" INTEGER[],
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "onlyOneDay" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "siswaId" INTEGER,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Izin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Izin" ADD CONSTRAINT "Izin_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "siswa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Izin" ADD CONSTRAINT "Izin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
