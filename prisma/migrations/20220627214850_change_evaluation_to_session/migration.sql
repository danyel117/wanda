/*
  Warnings:

  - You are about to drop the `EvaluationSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EvaluationSessionData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EvaluationTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Study` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Enum_StudySessionTaskStatus" AS ENUM ('NOT_STARTED', 'STARTED', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "Enum_StudySessionStatus" AS ENUM ('NOT_STARTED', 'STARTED', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "EvaluationSession" DROP CONSTRAINT "EvaluationSession_expertId_fkey";

-- DropForeignKey
ALTER TABLE "EvaluationSession" DROP CONSTRAINT "EvaluationSession_participantId_fkey";

-- DropForeignKey
ALTER TABLE "EvaluationSession" DROP CONSTRAINT "EvaluationSession_studyId_fkey";

-- DropForeignKey
ALTER TABLE "EvaluationSessionData" DROP CONSTRAINT "EvaluationSessionData_evaluationSessionId_fkey";

-- DropForeignKey
ALTER TABLE "EvaluationTask" DROP CONSTRAINT "EvaluationTask_evaluationSessionId_fkey";

-- DropForeignKey
ALTER TABLE "EvaluationTask" DROP CONSTRAINT "EvaluationTask_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Study" DROP CONSTRAINT "Study_scriptId_fkey";

-- DropForeignKey
ALTER TABLE "Study" DROP CONSTRAINT "Study_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_studyId_fkey";

-- DropForeignKey
ALTER TABLE "_study-participants" DROP CONSTRAINT "_study-participants_A_fkey";

-- DropTable
DROP TABLE "EvaluationSession";

-- DropTable
DROP TABLE "EvaluationSessionData";

-- DropTable
DROP TABLE "EvaluationTask";

-- DropTable
DROP TABLE "Study";

-- DropEnum
DROP TYPE "Enum_EvaluationSessionStatus";

-- DropEnum
DROP TYPE "Enum_TaskEvaluationStatus";

-- CreateTable
CREATE TABLE "StudySessionData" (
    "id" TEXT NOT NULL,
    "expertConsentBegin" BOOLEAN NOT NULL DEFAULT false,
    "participantConsentBegin" BOOLEAN NOT NULL DEFAULT false,
    "currentTask" INTEGER NOT NULL,
    "evaluationSessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudySessionData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySession" (
    "id" TEXT NOT NULL,
    "status" "Enum_StudySessionStatus" NOT NULL DEFAULT E'NOT_STARTED',
    "studyId" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySessionTask" (
    "id" TEXT NOT NULL,
    "status" "Enum_StudySessionTaskStatus" NOT NULL DEFAULT E'NOT_STARTED',
    "taskId" TEXT NOT NULL,
    "evaluationSessionId" TEXT NOT NULL,
    "expertComments" TEXT,
    "userRecording" TEXT,
    "expertRecording" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudySessionTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationStudy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "researchQuestion" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluationStudy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudySessionData_evaluationSessionId_key" ON "StudySessionData"("evaluationSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationStudy_userId_key" ON "EvaluationStudy"("userId");

-- AddForeignKey
ALTER TABLE "StudySessionData" ADD CONSTRAINT "StudySessionData_evaluationSessionId_fkey" FOREIGN KEY ("evaluationSessionId") REFERENCES "StudySession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "EvaluationStudy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySessionTask" ADD CONSTRAINT "StudySessionTask_evaluationSessionId_fkey" FOREIGN KEY ("evaluationSessionId") REFERENCES "StudySession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySessionTask" ADD CONSTRAINT "StudySessionTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "EvaluationStudy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationStudy" ADD CONSTRAINT "EvaluationStudy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationStudy" ADD CONSTRAINT "EvaluationStudy_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_study-participants" ADD CONSTRAINT "_study-participants_A_fkey" FOREIGN KEY ("A") REFERENCES "EvaluationStudy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
