import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FedapayModule } from '../fedapay/fedapay.module';
import { ParticipationsService } from './participations.service';
import { ParticipationsController } from './participations.controller';

@Module({
  imports: [PrismaModule, FedapayModule],
  providers: [ParticipationsService],
  controllers: [ParticipationsController]
})
export class ParticipationsModule {}

