import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AnalyzeModule } from './analyze/analyze.module';
import { DnsModule } from './dns/dns.module';
import { IpModule } from './ip/ip.module';
import { ReportModule } from './report/report.module';
import { HeadersModule } from './headers/headers.module';
import { LinksModule } from './links/links.module';
import { SslModule } from './ssl/ssl.module';
import { UptimeModule } from './uptime/uptime.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AnalyzeModule,
    ReportModule,
    HeadersModule,
    LinksModule,
    DnsModule,
    IpModule,
    SslModule,
    UptimeModule,
  ],
})
export class AppModule {}
