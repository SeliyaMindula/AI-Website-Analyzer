import { IsNotEmpty, IsString } from 'class-validator';

export class HeadersCheckDto {
  @IsString()
  @IsNotEmpty()
  url!: string;
}
