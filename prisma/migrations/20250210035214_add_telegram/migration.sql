-- AlterTable
ALTER TABLE "report_whatsapp" ADD COLUMN     "telegramId" TEXT,
ADD COLUMN     "telegran" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "whatsapp" BOOLEAN NOT NULL DEFAULT false;
