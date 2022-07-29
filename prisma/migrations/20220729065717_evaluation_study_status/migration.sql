-- CreateEnum
CREATE TYPE "Enum_EvaluationStudyStatus" AS ENUM ('DRAFT', 'ONGOING', 'COMPLETED');

-- AlterTable
ALTER TABLE "EvaluationStudy" ADD COLUMN     "status" "Enum_EvaluationStudyStatus" NOT NULL DEFAULT E'DRAFT';
