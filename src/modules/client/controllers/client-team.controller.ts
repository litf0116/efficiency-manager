import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TeamService } from '../../team/team.service';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('客户端-小组')
@Controller('client/teams')
export class ClientTeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: '获取小组列表' })
  findAll(@Query('warehouseId') warehouseId?: number) {
    return this.teamService.findAll(warehouseId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取小组详情' })
  findOne(@Query('id') id: number) {
    return this.teamService.findOne(id);
  }
}
