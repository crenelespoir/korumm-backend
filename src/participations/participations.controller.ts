import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ParticipationsService } from './participations.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('participations')
export class ParticipationsController {
    constructor(private readonly participationsService: ParticipationsService) {}

    // Route publique - sans guard, accessible à tout le monde
    @Post()
    create(@Body() dto: CreateParticipationDto) {
        return this.participationsService.create(dto);
    }

    // Route protégée - avec guard, accessible uniquement aux organisateurs
    @Get('event/:eventId')
    @UseGuards(JwtAuthGuard)
    findByEvent(@Param('eventId') eventId: string) {
        return this.participationsService.findByEvent(eventId);
    }
}
