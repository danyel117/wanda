/*
  Warnings:

  - A unique constraint covering the columns `[evaluationSessionId]` on the table `EvaluationSessionData` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `evaluationSessionId` to the `EvaluationSessionData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EvaluationSessionData" ADD COLUMN     "evaluationSessionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationSessionData_evaluationSessionId_key" ON "EvaluationSessionData"("evaluationSessionId");

-- AddForeignKey
ALTER TABLE "EvaluationSessionData" ADD CONSTRAINT "EvaluationSessionData_evaluationSessionId_fkey" FOREIGN KEY ("evaluationSessionId") REFERENCES "EvaluationSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
