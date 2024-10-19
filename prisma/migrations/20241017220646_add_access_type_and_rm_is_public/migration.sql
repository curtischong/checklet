/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Checker` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('PRIVATE', 'HIDDEN', 'PUBLIC');

-- AlterTable
ALTER TABLE "Checker" DROP COLUMN "isPublic",
ADD COLUMN     "accessType" "AccessType" NOT NULL DEFAULT 'PRIVATE';
