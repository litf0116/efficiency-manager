import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TeamService } from '../../server/team/team.service';
import { JwtAuthGuard } from '../../server/common/guards/jwt-auth.guard';

@ApiTags('H5端-小组')
@Controller('h5/teams')
export class H5TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取小组列表' })
  findAll(@Query('warehouseId') warehouseId?: number) {
    return this.teamService.findAll(warehouseId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取小组详情' })
  findOne(@Query('id') id: number) {
    return this.teamService.findOne(id);
  }
}
