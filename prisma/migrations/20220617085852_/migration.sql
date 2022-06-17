/*
  Warnings:

  - You are about to drop the column `evaluationSessionId` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Script` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Script` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_evaluationSessionId_fkey";

-- AlterTable
ALTER TABLE "Script" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "evaluationSessionId",
ADD COLUMN     "studyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Script_name_key" ON "Script"("name");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "Study"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
