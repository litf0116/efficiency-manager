import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: '张三' })
  @IsString()
  @IsOptional()
  realName?: string;

  @ApiPropertyOptional({ example: '13800138000' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ enum: ['ADMIN', 'FINANCE', 'LEADER'] })
  @IsEnum(['ADMIN', 'FINANCE', 'LEADER'])
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  teamId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  status?: number;
}
