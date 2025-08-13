/*
  Warnings:

  - The values [SUPERADMIN] on the enum `ROLE` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `reservation_id` on the `Call` table. All the data in the column will be lost.
  - You are about to drop the column `deferral_id` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `donor_conditions` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `job_details` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `network_provider1` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `network_provider2` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `permanent_deferral` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `ready_to_volunteer` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `facebookId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twitterId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `DonorDeferral` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ROLE_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "ROLE_new" USING ("role"::text::"ROLE_new");
ALTER TYPE "ROLE" RENAME TO "ROLE_old";
ALTER TYPE "ROLE_new" RENAME TO "ROLE";
DROP TYPE "ROLE_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_reservation_id_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_deferral_id_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_location_id_fkey";

-- DropForeignKey
ALTER TABLE "Donor" DROP CONSTRAINT "Donor_location_id_fkey";

-- DropForeignKey
ALTER TABLE "DonorDeferral" DROP CONSTRAINT "DonorDeferral_donor_id_fkey";

-- DropIndex
DROP INDEX "Call_reservation_id_key";

-- DropIndex
DROP INDEX "Donation_deferral_id_key";

-- DropIndex
DROP INDEX "User_facebookId_key";

-- DropIndex
DROP INDEX "User_googleId_key";

-- DropIndex
DROP INDEX "User_twitterId_key";

-- AlterTable
ALTER TABLE "Call" DROP COLUMN "reservation_id";

-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "deferral_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Donor" DROP COLUMN "donor_conditions",
DROP COLUMN "job_details",
DROP COLUMN "network_provider1",
DROP COLUMN "network_provider2",
DROP COLUMN "permanent_deferral",
DROP COLUMN "ready_to_volunteer";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "facebookId",
DROP COLUMN "googleId",
DROP COLUMN "twitterId";

-- DropTable
DROP TABLE "DonorDeferral";

-- DropTable
DROP TABLE "Log";

-- DropEnum
DROP TYPE "DEFERRAL_STATUS";
