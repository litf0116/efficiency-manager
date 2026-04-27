import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(warehouseId?: number) {
    return this.prisma.team.findMany({
      where: {
        status: 1,
        ...(warehouseId && { warehouseId }),
      },
      include: {
        warehouse: true,
        _count: {
          select: { users: true, weeklyReports: true },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.team.findUnique({
      where: { id },
      include: {
        warehouse: true,
        users: { select: { id: true, realName: true, role: true } },
      },
    });
  }

  create(dto: CreateTeamDto) {
    return this.prisma.team.create({
      data: dto,
      include: { warehouse: true },
    });
  }

  update(id: number, dto: UpdateTeamDto) {
    return this.prisma.team.update({
      where: { id },
      data: dto,
      include: { warehouse: true },
    });
  }

  async remove(id: number) {
    await this.prisma.team.update({
      where: { id },
      data: { status: 0 },
    });
    return { message: '删除成功' };
  }
}
