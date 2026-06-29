import { IsNotEmpty, IsString } from 'class-validator';

export class UptimeCheckDto {
  @IsString()
  @IsNotEmpty()
  url!: string;
}
