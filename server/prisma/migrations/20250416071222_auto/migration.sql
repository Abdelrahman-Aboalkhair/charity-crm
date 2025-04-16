/*
  Warnings:

  - You are about to drop the column `resetPasswordExpiresAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetPasswordExpiresAt",
ADD COLUMN     "resetPasswordTokenExpiresAt" TIMESTAMP(3);
