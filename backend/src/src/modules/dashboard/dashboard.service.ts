import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const currentYear = new Date().getFullYear();
    const currentWeek = this.getWeekNumber(new Date());

    const [totalTeams, totalReportsThisWeek, reportsThisMonth, targetRate] =
      await Promise.all([
        this.prisma.team.count({ where: { status: 1 } }),
        this.prisma.weeklyReport.count({
          where: { year: currentYear, week: currentWeek },
        }),
        this.prisma.weeklyReport.findMany({
          where: {
            year: currentYear,
            reportDate: {
              gte: new Date(currentYear, new Date().getMonth(), 1),
              lte: new Date(currentYear, new Date().getMonth() + 1, 0),
            },
          },
        }),
        this.prisma.systemConfig.findUnique({ where: { configKey: 'efficiency_target' } }),
      ]);

    const avgEfficiency = reportsThisMonth.length > 0
      ? reportsThisMonth.reduce((sum, r) => sum + Number(r.efficiency || 0), 0) / reportsThisMonth.length
      : 0;

    const target = Number(targetRate?.configValue) || 1.0;
    const passCount = reportsThisMonth.filter((r) => Number(r.efficiency || 0) >= target).length;
    const passRate = reportsThisMonth.length > 0
      ? (passCount / reportsThisMonth.length) * 100
      : 0;

    const lastMonthReports = await this.prisma.weeklyReport.findMany({
      where: {
        year: currentYear,
        reportDate: {
          gte: new Date(currentYear, new Date().getMonth() - 1, 1),
          lte: new Date(currentYear, new Date().getMonth(), 0),
        },
      },
    });

    const lastMonthAvg = lastMonthReports.length > 0
      ? lastMonthReports.reduce((sum, r) => sum + Number(r.efficiency || 0), 0) / lastMonthReports.length
      : 0;

    return {
      totalTeams,
      reportedTeamsThisWeek: totalReportsThisWeek,
      unreportedTeams: totalTeams - totalReportsThisWeek,
      avgEfficiency: Math.round(avgEfficiency * 1000) / 1000,
      passRate: Math.round(passRate * 10) / 10,
      compareLastMonth: lastMonthAvg > 0
        ? Math.round(((avgEfficiency - lastMonthAvg) / lastMonthAvg) * 100 * 10) / 10
        : 0,
      target,
    };
  }

  async getRanking(year?: number, month?: number) {
    const currentYear = year || new Date().getFullYear();
    const currentMonth = month || new Date().getMonth() + 1;

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);

    const reports = await this.prisma.weeklyReport.findMany({
      where: {
        year: currentYear,
        reportDate: { gte: startDate, lte: endDate },
      },
      include: {
        team: { include: { warehouse: true } },
      },
    });

    const grouped = new Map<number, any>();
    for (const r of reports) {
      if (!grouped.has(r.teamId)) {
        grouped.set(r.teamId, {
          team: r.team,
          totalEfficiency: 0,
          count: 0,
        });
      }
      const g = grouped.get(r.teamId);
      g.totalEfficiency += Number(r.efficiency || 0);
      g.count += 1;
    }

    const ranking = [];
    for (const [tid, g] of grouped) {
      ranking.push({
        rank: 0,
        team: g.team,
        avgEfficiency: Math.round((g.totalEfficiency / g.count) * 1000) / 1000,
        reportCount: g.count,
      });
    }

    ranking.sort((a, b) => b.avgEfficiency - a.avgEfficiency);
    ranking.forEach((item, index) => {
      item.rank = index + 1;
    });

    return ranking;
  }

  async getTrend(teamId?: number, weeks: number = 12) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - weeks * 7);

    const where: any = {
      reportDate: { gte: startDate, lte: endDate },
    };
    if (teamId) where.teamId = teamId;

    const reports = await this.prisma.weeklyReport.findMany({
      where,
      include: { team: true },
      orderBy: [{ year: 'asc' }, { week: 'asc' }],
    });

    return reports;
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}
