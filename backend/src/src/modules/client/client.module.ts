import { Module } from '@nestjs/common';
import { ClientAuthController } from './controllers/client-auth.controller';
import { ClientTeamController } from './controllers/client-team.controller';
import { ClientReportController } from './controllers/client-report.controller';
import { AuthModule } from '../auth/auth.module';
import { TeamModule } from '../team/team.module';
import { ReportModule } from '../report/report.module';

@Module({
  imports: [
    AuthModule,
    TeamModule,
    ReportModule,
  ],
  controllers: [
    ClientAuthController,
    ClientTeamController,
    ClientReportController,
  ],
})
export class ClientModule {}
