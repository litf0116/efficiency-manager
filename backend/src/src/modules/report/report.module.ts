import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { EfficiencyCalculateService } from './efficiency-calculate.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, EfficiencyCalculateService],
  exports: [ReportService],
})
export class ReportModule {}
