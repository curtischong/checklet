/*
  Warnings:

  - You are about to drop the column `promptHashThatDerivedRefinedPrompt` on the `Checker` table. All the data in the column will be lost.
  - You are about to drop the column `refinedPrompt` on the `Checker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Checker" DROP COLUMN "promptHashThatDerivedRefinedPrompt",
DROP COLUMN "refinedPrompt";
