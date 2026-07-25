import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsInt,
    Min,
    IsDateString,
    IsOptional,
    IsNumber,
    ValidateIf,
} from 'class-validator';
import { EventType } from '@prisma/client';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    titre!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    lieu!: string;

    @IsDateString()
    dateEvenement!: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsInt()
    @Min(1)
    nombrePlaces!: number;

    @IsEnum(EventType)
    type!: EventType;

    @ValidateIf((dto: CreateEventDto) => dto.type === EventType.PAYANT)
    @IsNumber()
    @Min(1)
    prix?: number;
}                           