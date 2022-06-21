/*
  Warnings:

  - You are about to drop the column `scriptId` on the `EvaluationSession` table. All the data in the column will be lost.
  - Added the required column `researchQuestion` to the `Study` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scriptId` to the `Study` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EvaluationSession" DROP CONSTRAINT "EvaluationSession_scriptId_fkey";

-- AlterTable
ALTER TABLE "EvaluationSession" DROP COLUMN "scriptId";

-- AlterTable
ALTER TABLE "Study" ADD COLUMN     "researchQuestion" TEXT NOT NULL,
ADD COLUMN     "scriptId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Study" ADD CONSTRAINT "Study_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
