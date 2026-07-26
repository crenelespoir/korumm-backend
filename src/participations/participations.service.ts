import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { EventType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParticipationDto } from './dto/create-participation.dto';

@Injectable()
export class ParticipationsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateParticipationDto) {
        // Vérifier si l'événement existe
        const event = await this.prisma.event.findUnique({
            where: { id: dto.eventId },
            include: { _count: { select: { participations: true } } },
        });

        if (!event) {
            throw new NotFoundException('Événement introuvable');
        }

        if (event.type === EventType.PAYANT) {
            throw new BadRequestException("Cet évènement est payant, l'inscription nécessite un paiement (fonctionnalité à venir)");
        }

        if (event._count.participations >= event.nombrePlaces) {
            throw new BadRequestException('Nombre de places atteint.');
        }

        const qrCode = randomBytes(16).toString('hex');

        try {
            return await this.prisma.participation.create({
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
    }

    async findByEvent(eventId: string) {
        return this.prisma.participation.findMany({
            where: { eventId },
            orderBy: { createdAt: 'asc' },
        });
    }
}
