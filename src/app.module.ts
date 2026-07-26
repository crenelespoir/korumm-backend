import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ParticipationsModule } from './participations/participations.module';

@Module({
  imports: [PrismaModule, AuthModule, EventsModule, ParticipationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
