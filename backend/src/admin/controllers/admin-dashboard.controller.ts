import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from '../../server/dashboard/dashboard.service';
import { Public } from '../../server/common/decorators/public.decorator';

@ApiTags('管理端-数据看板')
@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @Public()
  @ApiOperation({ summary: '汇总数据' })
  getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('ranking')
  @Public()
  @ApiOperation({ summary: '排名数据' })
  getRanking(@Query('year') year?: number, @Query('month') month?: number) {
    return this.dashboardService.getRanking(year, month);
  }

  @Get('trend')
  @Public()
  @ApiOperation({ summary: '趋势数据' })
  getTrend(@Query('teamId') teamId?: number, @Query('months') months?: number) {
    return this.dashboardService.getTrend(teamId, months ? months * 4 : 12);
  }
}
