import { IsUUID, IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateFeedbackEvenementDto {
  @IsUUID()
  participationId!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  note!: number;

  @IsOptional()
  @IsString()
  commentaire?: string;
}