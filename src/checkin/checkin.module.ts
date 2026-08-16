import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CheckinService } from './checkin.service';
import { CheckinController } from './checkin.controller';

@Module({
  imports: [PrismaModule],
  providers: [CheckinService],
  controllers: [CheckinController]
})
export class CheckinModule {}
