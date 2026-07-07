import { IsNotEmpty, IsString } from 'class-validator';

export class LinksCheckDto {
  @IsString()
  @IsNotEmpty()
  url!: string;
}
