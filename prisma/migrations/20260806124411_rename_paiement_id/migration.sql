/*
  Warnings:

  - The primary key for the `Paiement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `index` on the `Paiement` table. All the data in the column will be lost.
  - The required column `id` was added to the `Paiement` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Paiement" DROP CONSTRAINT "Paiement_pkey",
DROP COLUMN "index",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id");
