/*
  Warnings:

  - You are about to drop the `EvaluationSessionState` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Enum_TaskEvaluationStatus" AS ENUM ('NOT_STARTED', 'STARTED', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "Enum_EvaluationSessionStatus" AS ENUM ('NOT_STARTED', 'STARTED', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "EvaluationSessionState" DROP CONSTRAINT "EvaluationSessionState_evaluationSessionId_fkey";

-- DropForeignKey
ALTER TABLE "EvaluationSessionState" DROP CONSTRAINT "EvaluationSessionState_taskId_fkey";

-- AlterTable
ALTER TABLE "EvaluationSession" ADD COLUMN     "status" "Enum_EvaluationSessionStatus" NOT NULL DEFAULT E'NOT_STARTED';

-- DropTable
DROP TABLE "EvaluationSessionState";

-- DropEnum
DROP TYPE "Enum_EvaluationStatus";

-- CreateTable
CREATE TABLE "EvaluationTaskStatus" (
    "id" TEXT NOT NULL,
    "status" "Enum_TaskEvaluationStatus" NOT NULL DEFAULT E'NOT_STARTED',
    "taskId" TEXT NOT NULL,
    "evaluationSessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluationTaskStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EvaluationTaskStatus" ADD CONSTRAINT "EvaluationTaskStatus_evaluationSessionId_fkey" FOREIGN KEY ("evaluationSessionId") REFERENCES "EvaluationSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationTaskStatus" ADD CONSTRAINT "EvaluationTaskStatus_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
