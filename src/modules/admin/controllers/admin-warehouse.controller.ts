import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from '../../warehouse/dto/warehouse.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('管理端-仓库管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/warehouses')
export class AdminWarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  @ApiOperation({ summary: '获取仓库列表' })
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取仓库详情' })
  findOne(@Param('id') id: number) {
    return this.warehouseService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '创建仓库' })
  create(@Body() dto: CreateWarehouseDto) {
    return this.warehouseService.create(dto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '更新仓库' })
  update(@Param('id') id: number, @Body() dto: UpdateWarehouseDto) {
    return this.warehouseService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '删除仓库' })
  remove(@Param('id') id: number) {
    return this.warehouseService.remove(id);
  }
}
