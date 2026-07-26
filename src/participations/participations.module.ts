import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ParticipationsService } from './participations.service';
import { ParticipationsController } from './participations.controller';

@Module({
  imports: [PrismaModule],
  providers: [ParticipationsService],
  controllers: [ParticipationsController]
})
export class ParticipationsModule {}

