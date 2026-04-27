import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    // 演示模式：zhangsan / 888888
    if (dto.username === 'zhangsan' && dto.password === '888888') {
      const payload = { sub: 0, username: 'zhangsan', role: 'LEADER' };
      const token = this.jwtService.sign(payload);
      return {
        token,
        user: {
          id: 0,
          username: 'zhangsan',
          role: 'LEADER',
          realName: '演示用户',
          teamId: 1,
        },
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (user.status !== 1) {
      throw new UnauthorizedException('账号已被禁用');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        realName: user.realName,
        teamId: user.teamId,
      },
    };
  }

  async register(dto: RegisterDto) {
    const exist = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (exist) {
      throw new ConflictException('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        role: (dto.role as Role) || 'LEADER',
        realName: dto.realName,
        phone: dto.phone,
        teamId: dto.teamId,
      },
    });

    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }

  async getProfile(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
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
            warehouse: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
