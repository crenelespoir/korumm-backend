import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateEventDto, organisateurId: string) {
        return this.prisma.event.create({
            data: {
                titre: dto.titre,
                description: dto.description,
                lieu: dto.lieu,
                dateEvenement: new Date(dto.dateEvenement),
                image: dto.image,
                nombrePlaces: dto.nombrePlaces,
                type: dto.type,
                prix: dto.prix,
                organisateurId
            },
        });
    }

    async findAll() {
        return this.prisma.event.findMany({
            orderBy: {
                dateEvenement: 'asc',
            },
        });
    }
    
    async findOne(id: string) {
        const event = await this.prisma.event.findUnique({
            where: { id },
        });

        if (!event) {
            throw new NotFoundException('Evènement introuvable');
        }

        return event;
    }

    async update(id: string, dto: UpdateEventDto, organisateurId: string) {
        const event = await this.findOne(id);
        this.verifierProprietaire(event, organisateurId);

        return this.prisma.event.update({
            where: { id },
            data: {
                ...dto,
                dateEvenement: dto.dateEvenement ? new Date(dto.dateEvenement) : undefined,
            },
        });
    }

    async remove(id: string, organisateurId: string) {
        const event = await this.findOne(id);
        this.verifierProprietaire(event, organisateurId);

        await this.prisma.event.delete({
            where: { id },
        });
        return { message: 'Evènement supprimé avec succès' };
    }

    private verifierProprietaire(event: { organisateurId: string }, organisateurId: string) {
            if (event.organisateurId !== organisateurId) {
                throw new ForbiddenException('Vous n\'êtes pas l\'organisateur de cet évènement');
            }
        }
    }
