-- CreateEnum
CREATE TYPE "Enum_QuestionAskingProtocolType" AS ENUM ('TARGET', 'INTENT');

-- CreateEnum
CREATE TYPE "Enum_QuestionAskingProtocolCategory" AS ENUM ('STATE', 'GOAL', 'MEANS', 'EFFECT', 'EXPLORATORY', 'CONFIRMATORY');

-- CreateTable
CREATE TABLE "ParticipantQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "questionType" "Enum_QuestionAskingProtocolType" NOT NULL,
    "questionCategory" "Enum_QuestionAskingProtocolCategory" NOT NULL,
    "studySessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParticipantQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParticipantQuestion" ADD CONSTRAINT "ParticipantQuestion_studySessionId_fkey" FOREIGN KEY ("studySessionId") REFERENCES "StudySession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
