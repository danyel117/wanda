-- CreateEnum
CREATE TYPE "Enum_StudySessionType" AS ENUM ('ThinkAloud', 'QuestionAskingProtocol', 'Other');

-- AlterTable
ALTER TABLE "StudySession" ADD COLUMN     "isStandAlone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sessionType" "Enum_StudySessionType" NOT NULL DEFAULT E'ThinkAloud';
