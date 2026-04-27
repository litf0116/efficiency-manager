import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  warehouseId: number;

  @ApiProperty({ example: '仓储二部一组' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2楼', required: false })
  @IsString()
  @IsOptional()
  floor?: string;

  @ApiProperty({ example: '仓储', required: false })
  @IsString()
  @IsOptional()
  function?: string;
}

export class UpdateTeamDto {
  @ApiProperty({ example: '仓储二部一组', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '3楼', required: false })
  @IsString()
  @IsOptional()
  floor?: string;

  @ApiProperty({ example: '仓储', required: false })
  @IsString()
  @IsOptional()
  function?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  status?: number;
}
