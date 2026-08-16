import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { EventType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FedapayService } from 'src/fedapay/fedapay.service';
import { CreateParticipationDto } from './dto/create-participation.dto';

@Injectable()
export class ParticipationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fedapayService: FedapayService
    ) {}

    async create(dto: CreateParticipationDto) {
        // Vérifier si l'événement existe
        const event = await this.prisma.event.findUnique({
            where: { id: dto.eventId },
            include: { _count: { select: { participations: true } } },
        });

        if (!event) {
            throw new NotFoundException('Événement introuvable');
        }

        if (event._count.participations >= event.nombrePlaces) {
            throw new BadRequestException('Nombre de places atteint.');
        }

        const qrCode = randomBytes(16).toString('hex');

        let participation;
        try {
            participation = await this.prisma.participation.create({
                data: {
                    eventId: dto.eventId,
                    participantNom: dto.participantNom,
                    participantEmail: dto.participantEmail,
                    participantTel: dto.participantTel,
                    qrCode,
                },
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictException('Vous êtes déjà inscrit à cet évènement.');
            }
            throw error;
        }

        if (event.type === EventType.GRATUIT) {
            return { participation, paymentUrl: null };
        }   

        if (!event.prix) {
            throw new BadRequestException('Le prix de l’événement est manquant.');
        }

        const { transactionId, paymentUrl } = await this.fedapayService.creerTransactionEtLienPaiement({
            montant: Number(event.prix),
            description: `Inscription - ${event.titre}`,
            participantNom: dto.participantNom,
            participantEmail: dto.participantEmail,
        });

        await this.prisma.paiement.create({
            data: {
                montant: event.prix,
                referenceFedaPay: String(transactionId),
                statut: 'pending',
                participationId: participation.id,
            },
        });
        return { participation, paymentUrl };
    }

    async findByEvent(eventId: string) {
        return this.prisma.participation.findMany({
            where: { eventId },
            orderBy: { createdAt: 'asc' },
        });
    }
}
