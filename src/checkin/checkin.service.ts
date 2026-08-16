import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { EventType, ParticipationStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScanQrDto } from './dto/scan-qr.dto';

@Injectable()
export class CheckinService {
  constructor(private readonly prisma: PrismaService) {}

  async scan(dto: ScanQrDto) {
    const participation = await this.prisma.participation.findUnique({
      where: { qrCode: dto.qrCode },
      include: { event: true },
    });

    if (!participation) {
      throw new NotFoundException('Qr code invalide.');
    }

    if (participation.statut === ParticipationStatus.ANNULE) {
        throw new BadRequestException('Cette participation a été annulée.');
    }

    if (participation.statut === ParticipationStatus.PRESENT) {
        throw new ConflictException(
            `Déja scanné le ${participation.qrScanneAt?.toLocaleString('fr-FR')}`,
        );
    }

    // Evènement payant: le paiement doit être confirmé, INSCRIT ne suffit pas
    if (
        participation.event.type === EventType.PAYANT &&
        participation.statut !== ParticipationStatus.PAYE
    ) {
        throw new BadRequestException(
            'Le paiement de cette participation n\'est pas confirmé.',
        );
    }

    const updated = await this.prisma.participation.update({
      where: { id: participation.id },
      data: {
        statut: ParticipationStatus.PRESENT,
        qrScanneAt: new Date(),
      },
    });

    return {
      message: 'Entrée validée',
      participant: {
        nom: participation.participantNom,
        email: participation.participantEmail,
      },
      evenement: participation.event.titre,
        scanneAt: updated.qrScanneAt,
    };
  }
}
