import { IsNotEmpty, IsString } from 'class-validator';

export class AnalyzeDto {
  @IsString()
  @IsNotEmpty()
  url!: string;
}
