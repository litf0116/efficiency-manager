import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './server/prisma/prisma.module';
import { AuthModule } from './server/auth/auth.module';
import { UserModule } from './server/user/user.module';
import { TeamModule } from './server/team/team.module';
import { WarehouseModule } from './server/warehouse/warehouse.module';
import { ReportModule } from './server/report/report.module';
import { DashboardModule } from './server/dashboard/dashboard.module';
import { ConfigModule as SysConfigModule } from './server/config/config.module';
import { AdminModule } from './admin/admin.module';
import { H5Module } from './h5/h5.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    TeamModule,
    WarehouseModule,
    ReportModule,
    DashboardModule,
    SysConfigModule,
    AdminModule,
    H5Module,
  ],
})
export class AppModule {}
