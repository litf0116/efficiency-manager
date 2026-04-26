import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateConfigDto } from './dto/config.dto';

@Injectable()
export class ConfigService {
  constructor(private readonly prisma: PrismaService) {}

  getCurrentWeek() {
    const now = new Date()
    const year = now.getFullYear()
    const startOfYear = new Date(year, 0, 1)
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)

    const dayOfWeek = now.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(now)
    monday.setDate(now.getDate() + mondayOffset)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    const formatDate = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`

    return {
      year,
      weekNumber,
      startDate: formatDate(monday),
      endDate: formatDate(sunday),
    }
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
      } else if (c.configKey === 'low_threshold') {
        result.lowThreshold = Number(c.configValue);
      } else if (c.configKey === 'high_threshold') {
        result.highThreshold = Number(c.configValue);
      }
    }

    return result;
  }

  async updateThresholds(dto: UpdateConfigDto) {
    const updates = [];

    if (dto.efficiencyTarget !== undefined) {
      updates.push(
        this.prisma.systemConfig.upsert({
          where: { configKey: 'efficiency_target' },
          update: { configValue: String(dto.efficiencyTarget) },
          create: { configKey: 'efficiency_target', configValue: String(dto.efficiencyTarget) },
        }),
      );
    }

    if (dto.lowThreshold !== undefined) {
      updates.push(
        this.prisma.systemConfig.upsert({
          where: { configKey: 'low_threshold' },
          update: { configValue: String(dto.lowThreshold) },
          create: { configKey: 'low_threshold', configValue: String(dto.lowThreshold) },
        }),
      );
    }

    if (dto.highThreshold !== undefined) {
      updates.push(
        this.prisma.systemConfig.upsert({
          where: { configKey: 'high_threshold' },
          update: { configValue: String(dto.highThreshold) },
          create: { configKey: 'high_threshold', configValue: String(dto.highThreshold) },
        }),
      );
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

  async updateStdEfficiency(dto: { stdRate: number }) {
    return this.prisma.stdEfficiency.update({
      where: { id: 1 },
      data: { stdRate: dto.stdRate },
    });
  }
}
