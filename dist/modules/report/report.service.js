"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const efficiency_calculate_service_1 = require("./efficiency-calculate.service");
let ReportService = class ReportService {
    constructor(prisma, calcService) {
        this.prisma = prisma;
        this.calcService = calcService;
    }
    async submit(dto, user) {
        const teamId = dto.teamId || user.teamId;
        if (!teamId) {
            throw new common_1.ForbiddenException('用户未绑定小组');
        }
        const exist = await this.prisma.weeklyReport.findUnique({
            where: { teamId_year_week: { teamId, year: dto.year, week: dto.week } },
        });
        if (exist) {
            throw new common_1.ForbiddenException('该周报已存在，请使用更新接口');
        }
        const { details, ...reportData } = dto;
        const stdEfficiencies = await this.prisma.stdEfficiency.findMany({
            where: { status: 1 },
        });
        const { totalOutput, stdOutput, efficiency } = this.calcService.calculate(details || [], dto.totalHeadcount, stdEfficiencies);
        const report = await this.prisma.weeklyReport.create({
            data: {
                ...reportData,
                teamId,
                submitterId: user.id,
                totalOutput,
                stdOutput,
                efficiency,
                details: {
                    create: (details || []).map((d) => ({
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
    async getMine(user, teamId) {
        const targetTeamId = teamId || user.teamId;
        if (!targetTeamId) {
            throw new common_1.ForbiddenException('用户未绑定小组');
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
    async getByWeek(year, week, user) {
        const teamId = user.teamId;
        if (!teamId) {
            throw new common_1.ForbiddenException('用户未绑定小组');
        }
        return this.prisma.weeklyReport.findUnique({
            where: { teamId_year_week: { teamId, year, week } },
            include: {
                team: { include: { warehouse: true } },
                details: true,
            },
        });
    }
    async getByTeam(teamId) {
        return this.prisma.weeklyReport.findMany({
            where: { teamId },
            include: {
                team: true,
                details: true,
            },
            orderBy: [{ year: 'desc' }, { week: 'desc' }],
        });
    }
    async update(id, dto, user) {
        const report = await this.prisma.weeklyReport.findUnique({ where: { id } });
        if (!report) {
            throw new common_1.NotFoundException('周报不存在');
        }
        if (report.teamId !== user.teamId && user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('无权修改此周报');
        }
        const { details, ...reportData } = dto;
        const stdEfficiencies = await this.prisma.stdEfficiency.findMany({
            where: { status: 1 },
        });
        let totalOutput = report.totalOutput;
        let stdOutput = report.stdOutput;
        let efficiency = report.efficiency;
        if (details) {
            const calc = this.calcService.calculate(details, dto.totalHeadcount ?? report.totalHeadcount, stdEfficiencies);
            totalOutput = calc.totalOutput;
            stdOutput = calc.stdOutput;
            efficiency = calc.efficiency;
        }
        if (dto.totalHeadcount !== undefined) {
            const calc = this.calcService.calculate(details || [], dto.totalHeadcount, stdEfficiencies);
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
                        create: details.map((d) => ({
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
    async getAll(filters) {
        const { year, month, teamId, warehouseId } = filters;
        const where = {};
        if (year && month) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            where.reportDate = { gte: startDate, lte: endDate };
        }
        else if (year) {
            where.year = year;
        }
        if (teamId)
            where.teamId = teamId;
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
    async audit(id, dto) {
        const report = await this.prisma.weeklyReport.findUnique({ where: { id } });
        if (!report) {
            throw new common_1.NotFoundException('周报不存在');
        }
        return this.prisma.weeklyReport.update({
            where: { id },
            data: { status: dto.status },
        });
    }
    async getMonthly(year, month, teamId) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const where = {
            reportDate: { gte: startDate, lte: endDate },
        };
        if (teamId)
            where.teamId = teamId;
        const reports = await this.prisma.weeklyReport.findMany({
            where,
            include: {
                team: { include: { warehouse: true } },
                details: true,
            },
        });
        const grouped = new Map();
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
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        efficiency_calculate_service_1.EfficiencyCalculateService])
], ReportService);
//# sourceMappingURL=report.service.js.map