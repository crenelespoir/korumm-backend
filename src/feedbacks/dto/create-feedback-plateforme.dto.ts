import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateFeedbackPlateformeDto {
  @IsInt()
  @Min(1)
  @Max(5)
  note!: number;

  @IsOptional()
  @IsString()
  commentaire?: string;
}