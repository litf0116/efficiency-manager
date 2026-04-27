import { Controller, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../../server/user/user.service';
import { UpdateUserDto } from '../../server/user/dto/user.dto';
import { JwtAuthGuard } from '../../server/common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../server/common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('管理端-用户管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '获取用户列表' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新用户' })
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '删除用户' })
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
