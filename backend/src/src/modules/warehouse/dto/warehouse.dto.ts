import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty({ example: '海宁仓' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '浙江省海宁市', required: false })
  @IsString()
  @IsOptional()
  location?: string;
}

export class UpdateWarehouseDto {
  @ApiProperty({ example: '海宁仓', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '浙江省海宁市', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  status?: number;
}
