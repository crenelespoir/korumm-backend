import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackEvenementDto } from './dto/create-feedback-evenement.dto';
import { CreateFeedbackPlateformeDto } from './dto/create-feedback-plateforme.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('feedbacks')
export class FeedbacksController {
    constructor(private readonly feedbacksService: FeedbacksService) {}

    // Public - n'importe quel participant peut laisser un feedback
    @Post('evenement')
    createFeedbackEvenement(@Body() dto: CreateFeedbackEvenementDto) {
        return this.feedbacksService.createFeedbackEvenement(dto);
    }

    @Post('plateforme')
    createFeedbackPlateforme(@Body() dto: CreateFeedbackPlateformeDto) {
        return this.feedbacksService.createFeedbackPlateforme(dto);
    }

    // Protégé - seul l'organisateur peut voir les feedbacks
    @Get('event/:eventId')
    @UseGuards(JwtAuthGuard)
    findByEvent(@Param('eventId') eventId: string) {
        return this.feedbacksService.findByEvent(eventId);
    }
}