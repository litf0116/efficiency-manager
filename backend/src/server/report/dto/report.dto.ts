import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsArray, ValidateNested, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReportDetailDto {
  @ApiProperty({ example: 'inbound' })
  @IsString()
  module: string;

  @ApiProperty({ example: '新品入库' })
  @IsString()
  operation: string;

  @ApiProperty({ example: '件' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 8903 })
  @IsNumber()
  quantity: number;
}

export class SubmitReportDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  teamId?: number;

  @ApiProperty({ example: 2025 })
  @IsNumber()
  year: number;

  @ApiProperty({ example: 25 })
  @IsNumber()
  week: number;

  @ApiProperty({ example: '2025-06-16' })
  @IsDateString()
  reportDate: string;

  @ApiProperty({ example: 24 })
  @IsNumber()
  totalHeadcount: number;

  @ApiPropertyOptional({ example: 15 })
  @IsNumber()
  @IsOptional()
  formalWorkers?: number;

  @ApiPropertyOptional({ example: 9 })
  @IsNumber()
  @IsOptional()
  contractWorkers?: number;

  @ApiProperty({ type: [ReportDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportDetailDto)
  details: ReportDetailDto[];
}

export class UpdateReportDto {
  @ApiPropertyOptional({ example: 2025 })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({ example: 26 })
  @IsNumber()
  @IsOptional()
  week?: number;

  @ApiPropertyOptional({ example: '2025-06-23' })
  @IsDateString()
  @IsOptional()
  reportDate?: string;

  @ApiPropertyOptional({ example: 26 })
  @IsNumber()
  @IsOptional()
  totalHeadcount?: number;

  @ApiPropertyOptional({ example: 16 })
  @IsNumber()
  @IsOptional()
  formalWorkers?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  contractWorkers?: number;

  @ApiPropertyOptional({ type: [ReportDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportDetailDto)
  @IsOptional()
  details?: ReportDetailDto[];
}

export class AuditReportDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED'] })
  @IsString()
  status: 'APPROVED' | 'REJECTED';
}
