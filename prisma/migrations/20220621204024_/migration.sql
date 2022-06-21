/*
  Warnings:

  - Added the required column `url` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Script" ALTER COLUMN "recording" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "recording" TEXT,
ADD COLUMN     "url" TEXT NOT NULL;
