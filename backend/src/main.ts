import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局前缀
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors();

  // 全局校验管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger文档 - Admin API
  const adminSwaggerConfig = new DocumentBuilder()
    .setTitle('仓储人效管理系统 - 管理端')
    .setDescription('管理端 API 文档')
    .setVersion('1.0')
    .addTag('管理端-认证', '管理员认证相关接口')
    .addTag('管理端-数据看板', '数据看板相关接口')
    .addTag('管理端-用户管理', '用户管理相关接口')
    .addTag('管理端-小组管理', '小组管理相关接口')
    .addTag('管理端-仓库管理', '仓库管理相关接口')
    .addTag('管理端-系统配置', '系统配置相关接口')
    .addTag('管理端-周报管理', '周报管理相关接口')
    .addBearerAuth()
    .build();
  const adminDoc = SwaggerModule.createDocument(app, adminSwaggerConfig);
  SwaggerModule.setup('docs/admin', app, adminDoc);

    // Swagger文档 - H5 API
  const h5SwaggerConfig = new DocumentBuilder()
    .setTitle('仓储人效管理系统 - H5端')
    .setDescription('H5端 API 文档')
    .setVersion('1.0')
    .addTag('H5端-认证', 'H5端认证相关接口')
    .addTag('H5端-小组', '小组查询相关接口')
    .addTag('H5端-周报', '周报上报相关接口')
    .addBearerAuth()
    .build();
  const h5Doc = SwaggerModule.createDocument(app, h5SwaggerConfig);
  SwaggerModule.setup('docs/h5', app, h5Doc);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Admin API Docs: http://localhost:${port}/docs/admin`);
  console.log(`H5 API Docs: http://localhost:${port}/docs/h5`);
}

bootstrap();
