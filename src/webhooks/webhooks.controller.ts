import { Controller, Post, Req, Res, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import type {RawBodyRequest} from '@nestjs/common';
import { Webhook } from 'fedapay';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('fedapay')
  async handleFedaPay(@Req() req: RawBodyRequest<Request>, @Res() res: Response) {
    const signature = req.headers['x-fedapay-signature'] as string;

    let event: any;
    try {
      event = Webhook.constructEvent(
        req.rawBody as Buffer,
        signature,
        process.env.FEDAPAY_WEBHOOK_SECRET!,
      );
    } catch (err: any) {
      console.error('Signature webhook invalide:', err.message);
        return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }

    if (event.name === 'transaction.approved') {
        const transactionId = String(event.entity.id);

        const paiement = await this.prisma.paiement.findUnique({
            where: { referenceFedaPay: transactionId },
        });

        if (paiement) {
            await this.prisma.paiement.update({
                where: { id: paiement.id },
                data: { statut: 'APPROVED' },
            });

            await this.prisma.participation.update({
                where: { id: paiement.participationId },
                data: { statut: 'PAYE' },
            });
            console.log(`Paiement confirmé pour la participation ${paiement.participationId}`);
        } else {
            console.log('Aucun paiement trouvé pour referenceFedaPay:', transactionId);
        }
    } 

    return res.status(HttpStatus.OK).send();
    }
}