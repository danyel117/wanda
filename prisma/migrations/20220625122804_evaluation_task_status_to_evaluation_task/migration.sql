/*
  Warnings:

  - You are about to drop the `EvaluationTaskStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EvaluationTaskStatus" DROP CONSTRAINT "EvaluationTaskStatus_evaluationSessionId_fkey";

-- DropForeignKey
ALTER TABLE "EvaluationTaskStatus" DROP CONSTRAINT "EvaluationTaskStatus_taskId_fkey";

-- DropTable
DROP TABLE "EvaluationTaskStatus";

-- CreateTable
CREATE TABLE "EvaluationTask" (
    "id" TEXT NOT NULL,
    "status" "Enum_TaskEvaluationStatus" NOT NULL DEFAULT E'NOT_STARTED',
    "taskId" TEXT NOT NULL,
    "evaluationSessionId" TEXT NOT NULL,
    "expertComments" TEXT,
    "userRecording" TEXT,
    "expertRecording" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluationTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EvaluationTask" ADD CONSTRAINT "EvaluationTask_evaluationSessionId_fkey" FOREIGN KEY ("evaluationSessionId") REFERENCES "EvaluationSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationTask" ADD CONSTRAINT "EvaluationTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
