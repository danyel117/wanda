-- CreateEnum
CREATE TYPE "Enum_EvaluationStatus" AS ENUM ('CREATED', 'STARTED', 'COMPLETED', 'FINISHED');

-- CreateTable
CREATE TABLE "EvaluationSessionState" (
    "id" TEXT NOT NULL,
    "status" "Enum_EvaluationStatus" NOT NULL DEFAULT E'CREATED',
    "taskId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluationSessionState_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EvaluationSessionState" ADD CONSTRAINT "EvaluationSessionState_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
