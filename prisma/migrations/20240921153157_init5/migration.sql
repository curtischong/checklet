/*
  Warnings:

  - You are about to drop the column `promptHash` on the `Checker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Checker" DROP COLUMN "promptHash",
ADD COLUMN     "promptHashThatDerivedRefinedPrompt" TEXT NOT NULL DEFAULT '';
