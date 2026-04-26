import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitReportDto, UpdateReportDto, AuditReportDto } from './dto/report.dto';
import { EfficiencyCalculateService } from './efficiency-calculate.service';

@Injectable()
export class ReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly calcService: EfficiencyCalculateService,
  ) {}

  async submit(dto: SubmitReportDto, user: any) {
    const teamId = dto.teamId || user.teamId;

    if (!teamId) {
      throw new ForbiddenException('用户未绑定小组');
    }

    const exist = await this.prisma.weeklyReport.findUnique({
      where: { teamId_year_week: { teamId, year: dto.year, week: dto.week } },
    });

    if (exist) {
      throw new ForbiddenException('该周报已存在，请使用更新接口');
    }

    const { details, ...reportData } = dto;

    const stdEfficiencies = await this.prisma.stdEfficiency.findMany({
      where: { status: 1 },
    });

    const { totalOutput, stdOutput, efficiency } = this.calcService.calculate(
      details || [],
      dto.totalHeadcount,
      stdEfficiencies,
    );

    const report = await this.prisma.weeklyReport.create({
      data: {
        ...reportData,
        teamId,
        submitterId: user.id,
        totalOutput,
        stdOutput,
        efficiency,
        details: {
          create: (details || []).map((d: any) => ({
            module: d.module,
            operation: d.operation,
            unit: d.unit,
            quantity: d.quantity,
          })),
        },
      },
      include: {
        team: { include: { warehouse: true } },
        details: true,
      },
    });

    return report;
  }

  async getMine(user: any, teamId?: number) {
    const targetTeamId = teamId || user.teamId;

    if (!targetTeamId) {
      throw new ForbiddenException('用户未绑定小组');
    }

    return this.prisma.weeklyReport.findMany({
      where: { teamId: targetTeamId },
      include: {
        team: true,
        details: true,
      },
      orderBy: [{ year: 'desc' }, { week: 'desc' }],
    });
  }

  async getByWeek(year: number, week: number, user: any) {
    const teamId = user.teamId;

    if (!teamId) {
      throw new ForbiddenException('用户未绑定小组');
    }

    return this.prisma.weeklyReport.findUnique({
      where: { teamId_year_week: { teamId, year, week } },
      include: {
        team: { include: { warehouse: true } },
        details: true,
      },
    });
  }

  async getByTeam(teamId: number) {
    return this.prisma.weeklyReport.findMany({
      where: { teamId },
      include: {
        team: true,
        details: true,
      },
      orderBy: [{ year: 'desc' }, { week: 'desc' }],
    });
  }

  async update(id: number, dto: UpdateReportDto, user: any) {
    const report = await this.prisma.weeklyReport.findUnique({ where: { id } });

    if (!report) {
      throw new NotFoundException('周报不存在');
    }

    if (report.teamId !== user.teamId && user.role !== 'ADMIN') {
      throw new ForbiddenException('无权修改此周报');
    }

    const { details, ...reportData } = dto;

    const stdEfficiencies = await this.prisma.stdEfficiency.findMany({
      where: { status: 1 },
    });

    let totalOutput: any = report.totalOutput;
    let stdOutput: any = report.stdOutput;
    let efficiency: any = report.efficiency;

    if (details) {
      const calc = this.calcService.calculate(
        details,
        dto.totalHeadcount ?? report.totalHeadcount,
        stdEfficiencies,
      );
      totalOutput = calc.totalOutput;
      stdOutput = calc.stdOutput;
      efficiency = calc.efficiency;
    }

    if (dto.totalHeadcount !== undefined) {
      const calc = this.calcService.calculate(
        details || [],
        dto.totalHeadcount,
        stdEfficiencies,
      );
      totalOutput = calc.totalOutput;
      stdOutput = calc.stdOutput;
      efficiency = calc.efficiency;
    }

    await this.prisma.weeklyReportDetail.deleteMany({ where: { reportId: id } });

    return this.prisma.weeklyReport.update({
      where: { id },
      data: {
        ...reportData,
        totalOutput,
        stdOutput,
        efficiency,
        details: details
          ? {
              create: details.map((d: any) => ({
                module: d.module,
                operation: d.operation,
                unit: d.unit,
                quantity: d.quantity,
              })),
            }
          : undefined,
      },
      include: {
        team: { include: { warehouse: true } },
        details: true,
      },
    });
  }

  async getAll(filters: { year?: number; month?: number; teamId?: number; warehouseId?: number }) {
    const { year, month, teamId, warehouseId } = filters;

    const where: any = {};

    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      where.reportDate = { gte: startDate, lte: endDate };
    } else if (year) {
      where.year = year;
    }

    if (teamId) where.teamId = teamId;
    if (warehouseId) {
      where.team = { warehouseId };
    }

    return this.prisma.weeklyReport.findMany({
      where,
      include: {
        team: { include: { warehouse: true } },
        details: true,
      },
      orderBy: [{ year: 'desc' }, { week: 'desc' }],
    });
  }

  async audit(id: number, dto: AuditReportDto) {
    const report = await this.prisma.weeklyReport.findUnique({ where: { id } });

    if (!report) {
      throw new NotFoundException('周报不存在');
    }

    return this.prisma.weeklyReport.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async getMonthly(year: number, month: number, teamId?: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const where: any = {
      reportDate: { gte: startDate, lte: endDate },
    };
    if (teamId) where.teamId = teamId;

    const reports = await this.prisma.weeklyReport.findMany({
      where,
      include: {
        team: { include: { warehouse: true } },
        details: true,
      },
    });

    const grouped = new Map<number, any>();
    for (const r of reports) {
      if (!grouped.has(r.teamId)) {
        grouped.set(r.teamId, {
          team: r.team,
          reports: [],
          totalOutput: 0,
          stdOutput: 0,
          totalEfficiency: 0,
          count: 0,
        });
      }
      const g = grouped.get(r.teamId);
      g.reports.push(r);
      g.totalOutput += Number(r.totalOutput || 0);
      g.stdOutput += Number(r.stdOutput || 0);
      g.totalEfficiency += Number(r.efficiency || 0);
      g.count += 1;
    }

    const result = [];
    for (const [tid, g] of grouped) {
      const avgEfficiency = g.count > 0 ? g.totalEfficiency / g.count : 0;
      result.push({
        team: g.team,
        month: `${year}年${month}月`,
        totalOutput: g.totalOutput,
        stdOutput: g.stdOutput,
        avgEfficiency: avgEfficiency,
        reportCount: g.count,
        reports: g.reports,
      });
    }

    return result.sort((a, b) => b.avgEfficiency - a.avgEfficiency);
  }
}
