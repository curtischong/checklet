-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('PRIVATE', 'HIDDEN', 'PUBLIC');

-- AlterTable
ALTER TABLE "Checker" ADD COLUMN     "accessType" "AccessType" NOT NULL DEFAULT 'PRIVATE';
