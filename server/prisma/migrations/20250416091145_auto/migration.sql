/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Donation` table. All the data in the column will be lost.
  - The `status` column on the `Donation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DONATION_STATUS" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "createdAt",
DROP COLUMN "notes",
DROP COLUMN "updatedAt",
DROP COLUMN "status",
ADD COLUMN     "status" "DONATION_STATUS" NOT NULL DEFAULT 'PENDING';
