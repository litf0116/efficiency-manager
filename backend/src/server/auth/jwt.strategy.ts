import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'efficiency-manager-secret',
    });
  }

  async validate(payload: { sub: number; username: string; role: string }) {
    // 演示用户特殊处理（sub=0 是演示模式）
    if (payload.sub === 0) {
      return {
        id: 0,
        username: 'zhangsan',
        role: 'LEADER',
        teamId: 1,
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.status !== 1) {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      teamId: user.teamId,
    };
  }
}
