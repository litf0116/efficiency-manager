import { Module } from '@nestjs/common';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AdminUserController } from './controllers/admin-user.controller';
import { AdminTeamController } from './controllers/admin-team.controller';
import { AdminWarehouseController } from './controllers/admin-warehouse.controller';
import { AdminConfigController } from './controllers/admin-config.controller';
import { AdminReportController } from './controllers/admin-report.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { TeamModule } from '../team/team.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { ReportModule } from '../report/report.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TeamModule,
    WarehouseModule,
    ReportModule,
    DashboardModule,
    ConfigModule,
  ],
  controllers: [
    AdminAuthController,
    AdminDashboardController,
    AdminUserController,
    AdminTeamController,
    AdminWarehouseController,
    AdminConfigController,
    AdminReportController,
  ],
})
export class AdminModule {}
