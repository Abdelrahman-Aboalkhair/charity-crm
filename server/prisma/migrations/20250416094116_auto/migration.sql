/*
  Warnings:

  - The `status` column on the `DonorDeferral` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DEFERRAL_STATUS" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "DonorDeferral" DROP COLUMN "status",
ADD COLUMN     "status" "DEFERRAL_STATUS" NOT NULL DEFAULT 'ACTIVE';
