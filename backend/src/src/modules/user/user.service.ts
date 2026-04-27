import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      where: { status: 1 },
      select: {
        id: true,
        username: true,
        role: true,
        realName: true,
        phone: true,
        teamId: true,
        status: true,
        createdAt: true,
        team: {
          select: {
            id: true,
            name: true,
            warehouse: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        realName: true,
        phone: true,
        teamId: true,
        status: true,
        createdAt: true,
        team: {
          select: {
            id: true,
            name: true,
            warehouse: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return this.prisma.user.update({
      where: { id },
      data: dto as any,
      select: {
        id: true,
        username: true,
        role: true,
        realName: true,
        phone: true,
        teamId: true,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.user.update({
      where: { id },
      data: { status: 0 },
    });
    return { message: '删除成功' };
  }
}
