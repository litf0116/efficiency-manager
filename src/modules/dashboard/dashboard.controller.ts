import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('数据看板')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '汇总数据' })
  getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('ranking')
  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '排名数据' })
  getRanking(@Query('year') year?: number, @Query('month') month?: number) {
    return this.dashboardService.getRanking(year, month);
  }

  @Get('trend')
  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '趋势数据' })
  getTrend(@Query('teamId') teamId?: number, @Query('months') months?: number) {
    return this.dashboardService.getTrend(teamId, months ? months * 4 : 12);
  }
}
