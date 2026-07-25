import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req, } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  //Routes publiques - sans guard, accessible à tout le monde
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
    findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  //Routes protégées - avec guard, accessible uniquement aux utilisateurs authentifiés
  @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateEventDto, @Req() req: any) {
        return this.eventsService.create(dto, req.user.userId);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() dto: UpdateEventDto, @Req() req: any) {
        return this.eventsService.update(id, dto, req.user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @Req() req: any) {
        return this.eventsService.remove(id, req.user.userId);
    }
}
