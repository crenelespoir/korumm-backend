import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ParticipationsModule } from './participations/participations.module';
import { FedapayModule } from './fedapay/fedapay.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { CheckinModule } from './checkin/checkin.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';


@Module({
  imports: [PrismaModule, AuthModule, EventsModule, ParticipationsModule, FedapayModule, WebhooksModule, CheckinModule, FeedbacksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
