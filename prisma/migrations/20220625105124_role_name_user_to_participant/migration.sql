/*
  Warnings:

  - The values [USER] on the enum `Enum_RoleName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Enum_RoleName_new" AS ENUM ('ADMIN', 'EXPERT', 'PARTICIPANT');
ALTER TABLE "Role" ALTER COLUMN "name" TYPE "Enum_RoleName_new" USING ("name"::text::"Enum_RoleName_new");
ALTER TYPE "Enum_RoleName" RENAME TO "Enum_RoleName_old";
ALTER TYPE "Enum_RoleName_new" RENAME TO "Enum_RoleName";
DROP TYPE "Enum_RoleName_old";
COMMIT;
