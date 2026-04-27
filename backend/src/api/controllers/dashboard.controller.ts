import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from '../../server/dashboard/dashboard.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../server/common/guards/jwt-auth.guard';

@ApiTags('数据看板')
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: '汇总数据' })
  getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('ranking')
  @ApiOperation({ summary: '排名数据' })
  getRanking(@Query('year') year?: number, @Query('month') month?: number) {
    return this.dashboardService.getRanking(year, month);
  }

  @Get('trend')
  @ApiOperation({ summary: '趋势数据' })
  getTrend(@Query('teamId') teamId?: number, @Query('months') months?: number) {
    return this.dashboardService.getTrend(teamId, months ? months * 4 : 12);
  }
}
