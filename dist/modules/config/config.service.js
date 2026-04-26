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
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ConfigService = class ConfigService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getCurrentWeek() {
        const now = new Date();
        const year = now.getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        const dayOfWeek = now.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(now);
        monday.setDate(now.getDate() + mondayOffset);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        const formatDate = (d) => `${d.getMonth() + 1}月${d.getDate()}日`;
        return {
            year,
            weekNumber,
            startDate: formatDate(monday),
            endDate: formatDate(sunday),
        };
    }
    async getThresholds() {
        const configs = await this.prisma.systemConfig.findMany({
            where: { configKey: { in: ['efficiency_target', 'low_threshold', 'high_threshold'] } },
        });
        const result = {
            efficiencyTarget: 1.0,
            lowThreshold: 0.9,
            highThreshold: 1.5,
        };
        for (const c of configs) {
            if (c.configKey === 'efficiency_target') {
                result.efficiencyTarget = Number(c.configValue);
            }
            else if (c.configKey === 'low_threshold') {
                result.lowThreshold = Number(c.configValue);
            }
            else if (c.configKey === 'high_threshold') {
                result.highThreshold = Number(c.configValue);
            }
        }
        return result;
    }
    async updateThresholds(dto) {
        const updates = [];
        if (dto.efficiencyTarget !== undefined) {
            updates.push(this.prisma.systemConfig.upsert({
                where: { configKey: 'efficiency_target' },
                update: { configValue: String(dto.efficiencyTarget) },
                create: { configKey: 'efficiency_target', configValue: String(dto.efficiencyTarget) },
            }));
        }
        if (dto.lowThreshold !== undefined) {
            updates.push(this.prisma.systemConfig.upsert({
                where: { configKey: 'low_threshold' },
                update: { configValue: String(dto.lowThreshold) },
                create: { configKey: 'low_threshold', configValue: String(dto.lowThreshold) },
            }));
        }
        if (dto.highThreshold !== undefined) {
            updates.push(this.prisma.systemConfig.upsert({
                where: { configKey: 'high_threshold' },
                update: { configValue: String(dto.highThreshold) },
                create: { configKey: 'high_threshold', configValue: String(dto.highThreshold) },
            }));
        }
        await Promise.all(updates);
        return this.getThresholds();
    }
    getStdEfficiency() {
        return this.prisma.stdEfficiency.findMany({
            where: { status: 1 },
            orderBy: { module: 'asc' },
        });
    }
    async updateStdEfficiency(dto) {
        return this.prisma.stdEfficiency.update({
            where: { id: 1 },
            data: { stdRate: dto.stdRate },
        });
    }
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConfigService);
//# sourceMappingURL=config.service.js.map