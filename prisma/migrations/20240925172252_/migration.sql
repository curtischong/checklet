/*
  Warnings:

  - Added the required column `clonedFromId` to the `Checker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Checker" ADD COLUMN     "clonedFromId" UUID NOT NULL;
