import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TeamModule } from './modules/team/team.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { ReportModule } from './modules/report/report.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ConfigModule as SysConfigModule } from './modules/config/config.module';
import { AdminModule } from './modules/admin/admin.module';
import { ClientModule } from './modules/client/client.module';

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
    ClientModule,
  ],
})
export class AppModule {}
