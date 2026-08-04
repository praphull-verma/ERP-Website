/*
  Warnings:

  - You are about to drop the column `address` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "address",
ALTER COLUMN "skill_id" SET DEFAULT 0;
