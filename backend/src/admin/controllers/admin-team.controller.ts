import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamService } from '../../server/team/team.service';
import { CreateTeamDto, UpdateTeamDto } from '../../server/team/dto/team.dto';
import { JwtAuthGuard } from '../../server/common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../server/common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('管理端-小组管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/teams')
export class AdminTeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiOperation({ summary: '获取小组列表' })
  findAll(@Query('warehouseId') warehouseId?: number) {
    return this.teamService.findAll(warehouseId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取小组详情' })
  findOne(@Param('id') id: number) {
    return this.teamService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '创建小组' })
  create(@Body() dto: CreateTeamDto) {
    return this.teamService.create(dto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '更新小组' })
  update(@Param('id') id: number, @Body() dto: UpdateTeamDto) {
    return this.teamService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '删除小组' })
  remove(@Param('id') id: number) {
    return this.teamService.remove(id);
  }
}
