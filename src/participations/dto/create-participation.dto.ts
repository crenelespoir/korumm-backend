import { IsUUID, IsString, IsNotEmpty, IsEmail, IsOptional} from 'class-validator';

export class CreateParticipationDto {
    @IsUUID()
    eventId!: string;

    @IsString()
    @IsNotEmpty()
    participantNom!: string;

    @IsEmail()
    participantEmail!: string;

    @IsOptional()
    @IsString()
    participantTel?: string;
}