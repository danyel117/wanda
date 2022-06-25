-- CreateTable
CREATE TABLE "EvaluationSessionData" (
    "id" TEXT NOT NULL,
    "expertConsentBegin" BOOLEAN NOT NULL DEFAULT false,
    "participantConsentBegin" BOOLEAN NOT NULL DEFAULT false,
    "currentTask" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluationSessionData_pkey" PRIMARY KEY ("id")
);
