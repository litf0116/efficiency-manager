import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { EfficiencyCalculateService } from './efficiency-calculate.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ReportService, EfficiencyCalculateService],
  exports: [ReportService],
})
export class ReportModule {}
