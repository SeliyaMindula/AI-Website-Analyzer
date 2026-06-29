import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import * as dns from 'dns/promises';
import { parseIpOrDomain } from '../common/ip-validator';

interface IpWhoResponse {
  success: boolean;
  message?: string;
  ip: string;
  country?: string;
  country_code?: string;
  region?: string;
  city?: string;
  isp?: string;
  latitude?: number;
  longitude?: number;
  timezone?: { id?: string };
}

@Injectable()
export class IpService {
  async lookup(queryInput: string) {
    let query: string;
    let resolvedFrom: string | undefined;

    try {
      const parsed = parseIpOrDomain(queryInput);
      if (parsed.type === 'ip') {
        query = parsed.ip;
      } else {
        query = parsed.domain;
        const ips = await dns.resolve4(parsed.domain);
        if (!ips.length) throw new BadRequestException('Could not resolve domain to an IP');
        resolvedFrom = parsed.domain;
        query = ips[0];
      }
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Please enter a valid domain or IP address',
      );
    }

    const geo = await this.fetchGeolocation(query);

    return {
      query: queryInput.trim(),
      ip: query,
      resolvedFrom,
      country: geo.country ?? 'Unknown',
      countryCode: geo.country_code ?? '',
      region: geo.region ?? '',
      city: geo.city ?? '',
      isp: geo.isp ?? 'Unknown',
      latitude: geo.latitude ?? null,
      longitude: geo.longitude ?? null,
      timezone: geo.timezone?.id ?? '',
      lookedUpAt: new Date().toISOString(),
    };
  }

  private async fetchGeolocation(ip: string): Promise<IpWhoResponse> {
    try {
      const res = await fetch(`https://ipwho.is/${ip}`, {
        headers: { 'User-Agent': 'WebPulse-AI/1.0' },
      });
      if (!res.ok) throw new ServiceUnavailableException('Geolocation service unavailable');
      const data = (await res.json()) as IpWhoResponse;
      if (!data.success) {
        throw new BadRequestException(data.message ?? 'Could not geolocate IP');
      }
      return data;
    } catch (err) {
      if (err instanceof BadRequestException || err instanceof ServiceUnavailableException) throw err;
      throw new ServiceUnavailableException('Geolocation service unavailable');
    }
  }
}
