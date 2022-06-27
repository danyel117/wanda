/*
  Warnings:

  - You are about to drop the column `evaluationSessionId` on the `StudySessionData` table. All the data in the column will be lost.
  - You are about to drop the column `evaluationSessionId` on the `StudySessionTask` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studySessionId]` on the table `StudySessionData` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studySessionId` to the `StudySessionData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studySessionId` to the `StudySessionTask` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StudySessionData" DROP CONSTRAINT "StudySessionData_evaluationSessionId_fkey";

-- DropForeignKey
ALTER TABLE "StudySessionTask" DROP CONSTRAINT "StudySessionTask_evaluationSessionId_fkey";

-- DropIndex
DROP INDEX "StudySessionData_evaluationSessionId_key";

-- AlterTable
ALTER TABLE "StudySessionData" DROP COLUMN "evaluationSessionId",
ADD COLUMN     "studySessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StudySessionTask" DROP COLUMN "evaluationSessionId",
ADD COLUMN     "studySessionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StudySessionData_studySessionId_key" ON "StudySessionData"("studySessionId");

-- AddForeignKey
ALTER TABLE "StudySessionData" ADD CONSTRAINT "StudySessionData_studySessionId_fkey" FOREIGN KEY ("studySessionId") REFERENCES "StudySession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySessionTask" ADD CONSTRAINT "StudySessionTask_studySessionId_fkey" FOREIGN KEY ("studySessionId") REFERENCES "StudySession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
