import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('WebPulse tools (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(() => app.close());

  it('POST /headers/check returns response headers', () => {
    return request(app.getHttpServer())
      .post('/headers/check')
      .send({ url: 'https://example.com' })
      .expect(201)
      .expect((res) => {
        expect(res.body.statusCode).toBe(200);
        expect(res.body.headers.length).toBeGreaterThan(0);
        expect(res.body.finalUrl).toContain('example.com');
      });
  });

  it('POST /ip/lookup returns geolocation for a public IP', () => {
    return request(app.getHttpServer())
      .post('/ip/lookup')
      .send({ query: '8.8.8.8' })
      .expect(201)
      .expect((res) => {
        expect(res.body.ip).toBe('8.8.8.8');
        expect(res.body.country).toBeDefined();
        expect(res.body.isp).toBeDefined();
      });
  });
});
