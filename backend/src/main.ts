import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('仓储人效管理系统 - API')
    .setDescription('统一 API 文档')
    .setVersion('1.0')
    .addTag('认证', '登录、注册、获取用户信息')
    .addTag('小组管理', '小组列表、详情、创建、更新、删除')
    .addTag('周报管理', '周报提交、查询、修改、审核')
    .addTag('管理端-用户管理', '管理员专属：用户CRUD')
    .addTag('管理端-仓库管理', '管理员专属：仓库CRUD')
    .addTag('管理端-数据看板', '管理员专属：看板数据')
    .addTag('管理端-系统配置', '管理员专属：系统配置')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, doc);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API Docs: http://localhost:${port}/docs`);
}

bootstrap();
