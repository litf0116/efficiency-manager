import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { EfficiencyCalculateService } from './efficiency-calculate.service';

@Module({
  providers: [ReportService, EfficiencyCalculateService],
  exports: [ReportService],
})
export class ReportModule {}
