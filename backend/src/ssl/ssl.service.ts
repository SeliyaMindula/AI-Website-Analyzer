import { BadRequestException, Injectable, GatewayTimeoutException } from '@nestjs/common';
import * as tls from 'tls';
import { normalizeDomain } from '../common/domain-validator';

@Injectable()
export class SslService {
  check(domainInput: string): Promise<Record<string, unknown>> {
    let domain: string;
    try {
      domain = normalizeDomain(domainInput);
    } catch {
      throw new BadRequestException('Please enter a valid domain');
    }

    return new Promise((resolve, reject) => {
      const socket = tls.connect(
        { host: domain, port: 443, servername: domain, rejectUnauthorized: false, timeout: 10_000 },
        () => {
          const cert = socket.getPeerCertificate();
          const protocol = socket.getProtocol() ?? 'unknown';
          socket.end();

          if (!cert || !cert.valid_to) {
            reject(new BadRequestException('Could not retrieve certificate'));
            return;
          }

          const validTo = new Date(cert.valid_to);
          const validFrom = new Date(cert.valid_from);
          const now = new Date();
          const daysRemaining = Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const altNames = cert.subjectaltname
            ? cert.subjectaltname.split(', ').slice(0, 10)
            : [];

          resolve({
            domain,
            valid: now >= validFrom && now <= validTo,
            issuer: cert.issuer?.O ?? cert.issuer?.CN ?? 'Unknown',
            subject: cert.subject?.CN ?? domain,
            validFrom: validFrom.toISOString(),
            validTo: validTo.toISOString(),
            daysRemaining,
            protocol,
            altNames,
            checkedAt: new Date().toISOString(),
          });
        },
      );

      socket.on('error', () => {
        reject(new BadRequestException('Could not connect to host on port 443'));
      });
      socket.on('timeout', () => {
        socket.destroy();
        reject(new GatewayTimeoutException('SSL check timed out'));
      });
    });
  }
}
