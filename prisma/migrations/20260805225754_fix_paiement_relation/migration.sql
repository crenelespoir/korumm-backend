/*
  Warnings:

  - You are about to drop the column `paiementIndex` on the `Participation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[participationId]` on the table `Paiement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `participationId` to the `Paiement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Participation" DROP CONSTRAINT "Participation_paiementIndex_fkey";

-- AlterTable
ALTER TABLE "Paiement" ADD COLUMN     "participationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Participation" DROP COLUMN "paiementIndex";

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_participationId_key" ON "Paiement"("participationId");

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "Participation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
