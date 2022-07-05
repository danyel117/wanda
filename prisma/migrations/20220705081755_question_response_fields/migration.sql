/*
  Warnings:

  - Added the required column `position` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "position" INTEGER NOT NULL,
ADD COLUMN     "sus" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "QuestionResponse" ADD COLUMN     "responseAudio" TEXT,
ADD COLUMN     "responseNumber" INTEGER,
ADD COLUMN     "responseText" TEXT;
