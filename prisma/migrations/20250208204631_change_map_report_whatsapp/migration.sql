/*
  Warnings:

  - You are about to drop the `ReportWhatsapp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ReportWhatsapp";

-- CreateTable
CREATE TABLE "report_whatsapp" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "jid" TEXT NOT NULL,
    "type" "TypeReportWhatsapp" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "report_whatsapp_pkey" PRIMARY KEY ("id")
);
