import { IsNotEmpty, IsString } from 'class-validator';

export class IpLookupDto {
  @IsString()
  @IsNotEmpty()
  query!: string;
}
