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

  it('GET /speed-test/ping returns timestamp', () => {
    return request(app.getHttpServer())
      .get('/speed-test/ping')
      .expect(200)
      .expect((res) => expect(res.body.timestamp).toBeDefined());
  });

  it('GET /speed-test/download returns binary', () => {
    return request(app.getHttpServer())
      .get('/speed-test/download?size=1mb')
      .expect(200)
      .expect((res) => expect(res.body.length).toBe(1024 * 1024));
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
