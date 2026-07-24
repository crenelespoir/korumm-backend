-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('GRATUIT', 'PAYANT');

-- CreateEnum
CREATE TYPE "ParticipationStatus" AS ENUM ('INSCRIT', 'PAYE', 'PRESENT', 'ANNULE');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('EVENEMENT', 'PLATEFORME');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lieu" TEXT NOT NULL,
    "dateEvenement" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "nombrePlaces" INTEGER NOT NULL,
    "type" "EventType" NOT NULL,
    "prix" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organisateurId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participation" (
    "id" TEXT NOT NULL,
    "statut" "ParticipationStatus" NOT NULL DEFAULT 'INSCRIT',
    "qrCode" TEXT NOT NULL,
    "qrScanneAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" TEXT NOT NULL,
    "participantNom" TEXT NOT NULL,
    "participantEmail" TEXT NOT NULL,
    "participantTel" TEXT,
    "paiementIndex" TEXT,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "index" TEXT NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "referenceFedaPay" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("index")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "note" INTEGER,
    "commentaire" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "participationId" TEXT,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Event_organisateurId_idx" ON "Event"("organisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "Participation_qrCode_key" ON "Participation"("qrCode");

-- CreateIndex
CREATE INDEX "Participation_eventId_idx" ON "Participation"("eventId");

-- CreateIndex
CREATE INDEX "Participation_qrCode_idx" ON "Participation"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "Participation_eventId_participantEmail_key" ON "Participation"("eventId", "participantEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_referenceFedaPay_key" ON "Paiement"("referenceFedaPay");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_participationId_key" ON "Feedback"("participationId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organisateurId_fkey" FOREIGN KEY ("organisateurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_paiementIndex_fkey" FOREIGN KEY ("paiementIndex") REFERENCES "Paiement"("index") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "Participation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
