/*
  Warnings:

  - Added the required column `evaluationSessionId` to the `EvaluationSessionState` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EvaluationSessionState" ADD COLUMN     "evaluationSessionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "EvaluationSessionState" ADD CONSTRAINT "EvaluationSessionState_evaluationSessionId_fkey" FOREIGN KEY ("evaluationSessionId") REFERENCES "EvaluationSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
