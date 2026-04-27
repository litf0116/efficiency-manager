import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { TeamController } from './controllers/team.controller';
import { ReportController } from './controllers/report.controller';
import { UserController } from './controllers/user.controller';
import { DashboardController } from './controllers/dashboard.controller';
import { ConfigController } from './controllers/config.controller';
import { WarehouseController } from './controllers/warehouse.controller';

import { AuthModule } from '../server/auth/auth.module';
import { UserModule } from '../server/user/user.module';
import { TeamModule } from '../server/team/team.module';
import { WarehouseModule } from '../server/warehouse/warehouse.module';
import { ReportModule } from '../server/report/report.module';
import { DashboardModule } from '../server/dashboard/dashboard.module';
import { ConfigModule } from '../server/config/config.module';

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
    AuthController,
    TeamController,
    ReportController,
    UserController,
    DashboardController,
    ConfigController,
    WarehouseController,
  ],
})
export class ApiModule {}
