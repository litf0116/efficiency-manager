import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto/warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.warehouse.findMany({
      where: { status: 1 },
      include: {
        _count: { select: { teams: true } },
      },
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        teams: {
          where: { status: 1 },
          orderBy: { id: 'asc' },
        },
      },
    });
  }

  create(dto: CreateWarehouseDto) {
    return this.prisma.warehouse.create({
      data: dto,
    });
  }

  update(id: number, dto: UpdateWarehouseDto) {
    return this.prisma.warehouse.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.prisma.warehouse.update({
      where: { id },
      data: { status: 0 },
    });
    return { message: '删除成功' };
  }
}
