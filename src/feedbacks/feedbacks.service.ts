import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { ParticipationStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedbackEvenementDto } from './dto/create-feedback-evenement.dto';
import { CreateFeedbackPlateformeDto } from './dto/create-feedback-plateforme.dto';

@Injectable()
export class FeedbacksService {
    constructor(private readonly prisma: PrismaService) {}

    async createFeedbackEvenement(dto: CreateFeedbackEvenementDto) {
        const participation = await this.prisma.participation.findUnique({
            where: { id: dto.participationId },
            include: { feedback: true },
        });

        if (!participation) {
            throw new NotFoundException('Participation introuvable');
        }

        if (participation.statut !== ParticipationStatus.PRESENT) {
            throw new BadRequestException("Le feedback n'est possible qu'après avoir participé à l'événement",  
            );
        }

        if (participation.feedback) {
            throw new ConflictException('Feedback déjà soumis pour cette participation');
        }

        return this.prisma.feedback.create({
            data: {
                type: 'EVENEMENT',
                note: dto.note,
                commentaire: dto.commentaire,
                participationId: dto.participationId
            },
        });
    }

    async createFeedbackPlateforme(dto: CreateFeedbackPlateformeDto) {
        return this.prisma.feedback.create({
            data: {
                type: 'PLATEFORME',
                note: dto.note,
                commentaire: dto.commentaire,
                participationId: null
            },
        });
    }

    async findByEvent(eventId: string) {
        return this.prisma.feedback.findMany({
            where: {
                type: 'EVENEMENT',
                participation: { eventId }
            },
            include: { participation: true }
        });
    }
}   