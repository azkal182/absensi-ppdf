-- CreateEnum
CREATE TYPE "TypeReportWhatsapp" AS ENUM ('GROUP', 'PERSONAL');

-- CreateTable
CREATE TABLE "ReportWhatsapp" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "jid" TEXT NOT NULL,
    "type" "TypeReportWhatsapp" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ReportWhatsapp_pkey" PRIMARY KEY ("id")
);
