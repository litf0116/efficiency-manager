import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { UpdateConfigDto } from './dto/config.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('系统配置')
@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('current-week')
  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取当前周' })
  getCurrentWeek() {
    return this.configService.getCurrentWeek();
  }

  @Get('thresholds')
  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取阈值配置' })
  getThresholds() {
    return this.configService.getThresholds();
  }

  @Put('thresholds')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '更新阈值配置' })
  updateThresholds(@Body() dto: UpdateConfigDto) {
    return this.configService.updateThresholds(dto);
  }

  @Get('std-efficiency')
  @ApiOperation({ summary: '获取标准人效配置' })
  getStdEfficiency() {
    return this.configService.getStdEfficiency();
  }

  @Put('std-efficiency/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '更新标准人效' })
  updateStdEfficiency(@Body() dto: { stdRate: number }) {
    return this.configService.updateStdEfficiency(dto);
  }
}
