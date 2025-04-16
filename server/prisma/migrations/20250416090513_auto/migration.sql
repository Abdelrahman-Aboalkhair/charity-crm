/*
  Warnings:

  - Added the required column `gender` to the `Donor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Donor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Donor" ADD COLUMN     "gender" "GENDER" NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" TEXT NOT NULL;
