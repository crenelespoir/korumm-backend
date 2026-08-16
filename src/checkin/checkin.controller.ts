import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { ScanQrDto } from './dto/scan-qr.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('checkin')
@UseGuards(JwtAuthGuard)
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

    @Post('scan')
    scan(@Body() dto: ScanQrDto) {
        return this.checkinService.scan(dto);
    }
}