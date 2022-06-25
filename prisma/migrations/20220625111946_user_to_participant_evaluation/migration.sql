/*
  Warnings:

  - You are about to drop the column `userId` on the `EvaluationSession` table. All the data in the column will be lost.
  - Added the required column `participantId` to the `EvaluationSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EvaluationSession" DROP CONSTRAINT "EvaluationSession_userId_fkey";

-- AlterTable
ALTER TABLE "EvaluationSession" DROP COLUMN "userId",
ADD COLUMN     "participantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "EvaluationSession" ADD CONSTRAINT "EvaluationSession_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
