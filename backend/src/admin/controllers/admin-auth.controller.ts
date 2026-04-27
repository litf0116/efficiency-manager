import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../../server/auth/auth.service';
import { LoginDto } from '../../server/auth/dto/login.dto';
import { RegisterDto } from '../../server/auth/dto/register.dto';
import { JwtAuthGuard } from '../../server/common/guards/jwt-auth.guard';
import { Public } from '../../server/common/decorators/public.decorator';

@ApiTags('管理端-认证')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: '管理员登录' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @ApiOperation({ summary: '管理员注册' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前管理员信息' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }
}
