import { IsNotEmpty, IsString } from 'class-validator';

export class DnsLookupDto {
  @IsString()
  @IsNotEmpty()
  domain!: string;
}
