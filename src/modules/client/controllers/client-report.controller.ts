import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportService } from '../../report/report.service';
import { SubmitReportDto, UpdateReportDto } from '../../report/dto/report.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('客户端-周报')
@Controller('client/reports')
export class ClientReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: '提交周报' })
  submit(@Body() dto: SubmitReportDto, @Request() req) {
    return this.reportService.submit(dto, req.user);
  }

  @Get('week')
  @Public()
  @ApiOperation({ summary: '获取某小组周报' })
  getByTeam(@Query('teamId') teamId: number) {
    return this.reportService.getByTeam(teamId);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '我的上报记录' })
  getMine(@Query('teamId') teamId: number, @Request() req) {
    return this.reportService.getMine(req.user, teamId);
  }

  @Get('week/:year/:week')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取某周我的数据' })
  getByWeek(@Param('year') year: number, @Param('week') week: number, @Request() req) {
    return this.reportService.getByWeek(year, week, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '修改我的上报' })
  update(@Param('id') id: number, @Body() dto: UpdateReportDto, @Request() req) {
    return this.reportService.update(id, dto, req.user);
  }

  @Get('monthly')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '月度汇总' })
  getMonthly(
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('teamId') teamId?: number,
  ) {
    return this.reportService.getMonthly(+year, +month, teamId);
  }
}
