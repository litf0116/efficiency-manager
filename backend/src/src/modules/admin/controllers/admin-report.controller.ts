import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportService } from '../../report/report.service';
import { AuditReportDto } from '../../report/dto/report.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('管理端-周报管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/reports')
export class AdminReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.FINANCE)
  @ApiOperation({ summary: '所有人效数据' })
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
