import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { SubmitReportDto, UpdateReportDto, AuditReportDto } from './dto/report.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('周报管理')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: '提交周报' })
  @UseGuards(JwtAuthGuard)
  submit(@Body() dto: SubmitReportDto, @Request() req) {
    return this.reportService.submit(dto, req.user);
  }

  @Get('week')
  @Public()
  @ApiOperation({ summary: '获取某小组周报' })
  @UseGuards(JwtAuthGuard)
  getByTeam(@Query('teamId') teamId: number) {
    return this.reportService.getByTeam(teamId);
  }

  @Get('mine')
  @ApiOperation({ summary: '我的上报记录' })
  getMine(@Query('teamId') teamId: number, @Request() req) {
    return this.reportService.getMine(req.user, teamId);
  }

  @Get('week/:year/:week')
  @ApiOperation({ summary: '获取某周我的数据' })
  getByWeek(@Param('year') year: number, @Param('week') week: number, @Request() req) {
    return this.reportService.getByWeek(year, week, req.user);
  }

  @Put(':id')
  @ApiOperation({ summary: '修改我的上报' })
  update(@Param('id') id: number, @Body() dto: UpdateReportDto, @Request() req) {
    return this.reportService.update(id, dto, req.user);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.FINANCE)
  @ApiOperation({ summary: '所有人效数据(管理)' })
  getAll(
    @Query('year') year?: number,
    @Query('month') month?: number,
    @Query('teamId') teamId?: number,
    @Query('warehouseId') warehouseId?: number,
  ) {
    return this.reportService.getAll({ year, month, teamId, warehouseId });
  }

  @Put(':id/audit')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.FINANCE)
  @ApiOperation({ summary: '审核数据' })
  audit(@Param('id') id: number, @Body() dto: AuditReportDto) {
    return this.reportService.audit(id, dto);
  }

  @Get('monthly')
  @ApiOperation({ summary: '月度汇总' })
  getMonthly(
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('teamId') teamId?: number,
  ) {
    return this.reportService.getMonthly(+year, +month, teamId);
  }
}
