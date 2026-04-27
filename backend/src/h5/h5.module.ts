import { Module } from '@nestjs/common';
import { H5AuthController } from './controllers/h5-auth.controller';
import { H5TeamController } from './controllers/h5-team.controller';
import { H5ReportController } from './controllers/h5-report.controller';
import { AuthModule } from '../server/auth/auth.module';
import { TeamModule } from '../server/team/team.module';
import { ReportModule } from '../server/report/report.module';

@Module({
  imports: [
    AuthModule,
    TeamModule,
    ReportModule,
  ],
  controllers: [
    H5AuthController,
    H5TeamController,
    H5ReportController,
  ],
})
export class H5Module {}
