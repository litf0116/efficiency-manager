import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from './app.module';

const request = supertest;

describe('API Endpoints (e2e)', () => {
  let app: INestApplication;
  let leaderToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('认证 (Auth)', () => {
    it('POST /api/auth/login - 演示用户登录', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'zhangsan', password: '888888' })
        .expect(201);

      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', 'zhangsan');
      leaderToken = res.body.token;
    });

    it('POST /api/auth/login - 登录失败 (密码不足6位)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'zhangsan', password: '123' })
        .expect(400);

      expect(res.body.message).toBeDefined();
    });

    it('POST /api/auth/login - 登录失败 (用户不存在)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'nonexistent', password: '123456' })
        .expect(401);
    });

    it('GET /api/auth/me - 获取当前用户', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${leaderToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('username');
    });

    it('GET /api/auth/me - 未授权', async () => {
      await request(app.getHttpServer()).get('/api/auth/me').expect(401);
    });
  });

  describe('仓库管理 (Warehouses)', () => {
    it('GET /api/warehouses - 获取仓库列表', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/warehouses')
        .set('Authorization', `Bearer ${leaderToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/warehouses/1 - 获取仓库详情', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/warehouses/1')
        .set('Authorization', `Bearer ${leaderToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('id');
    });

    it('GET /api/warehouses - 未授权', async () => {
      await request(app.getHttpServer()).get('/api/warehouses').expect(401);
    });
  });

  describe('小组管理 (Teams)', () => {
    it('GET /api/teams - 获取小组列表', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/teams')
        .set('Authorization', `Bearer ${leaderToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/teams/1 - 获取小组详情', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/teams/1')
        .set('Authorization', `Bearer ${leaderToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('id');
    });
  });

  describe('周报管理 (Reports)', () => {
    it('GET /api/reports/week - 获取周报', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/reports/week')
        .set('Authorization', `Bearer ${leaderToken}`)
        .query({ teamId: 1 })
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/reports/mine - 获取我的周报', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/reports/mine')
        .set('Authorization', `Bearer ${leaderToken}`)
        .query({ teamId: 1 })
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/reports/monthly - 月度汇总', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/reports/monthly')
        .set('Authorization', `Bearer ${leaderToken}`)
        .query({ year: 2026, month: 4 })
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('系统配置 (Config)', () => {
    it('GET /api/config/current-week - 获取当前周', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/config/current-week')
        .set('Authorization', `Bearer ${leaderToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('year');
      expect(res.body).toHaveProperty('weekNumber');
    });

    it('GET /api/config/thresholds - 获取阈值配置', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/config/thresholds')
        .set('Authorization', `Bearer ${leaderToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('lowThreshold');
      expect(res.body).toHaveProperty('highThreshold');
    });

    it('GET /api/config/std-efficiency - 获取标准人效', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/config/std-efficiency')
        .set('Authorization', `Bearer ${leaderToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('数据看板 (Dashboard)', () => {
    it('GET /api/dashboard/summary - 看板汇总', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dashboard/summary')
        .set('Authorization', `Bearer ${leaderToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('totalTeams');
      expect(res.body).toHaveProperty('reportedTeamsThisWeek');
    });

    it('GET /api/dashboard/ranking - 排名数据', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dashboard/ranking')
        .set('Authorization', `Bearer ${leaderToken}`)
        .query({ year: 2026, month: 4 })
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/dashboard/trend - 趋势数据', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dashboard/trend')
        .set('Authorization', `Bearer ${leaderToken}`)
        .query({ months: 3 })
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
