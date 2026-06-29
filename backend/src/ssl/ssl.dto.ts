import { IsNotEmpty, IsString } from 'class-validator';

export class SslCheckDto {
  @IsString()
  @IsNotEmpty()
  domain!: string;
}
