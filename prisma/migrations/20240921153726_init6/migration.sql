/*
  Warnings:

  - The `promptHashThatDerivedRefinedPrompt` column on the `Checker` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Checker" DROP COLUMN "promptHashThatDerivedRefinedPrompt",
ADD COLUMN     "promptHashThatDerivedRefinedPrompt" INTEGER NOT NULL DEFAULT 0;
