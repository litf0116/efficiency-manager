import { IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateConfigDto {
  @ApiPropertyOptional({ example: 1.0 })
  @IsNumber()
  @IsOptional()
  efficiencyTarget?: number;

  @ApiPropertyOptional({ example: 0.9 })
  @IsNumber()
  @IsOptional()
  lowThreshold?: number;

  @ApiPropertyOptional({ example: 1.5 })
  @IsNumber()
  @IsOptional()
  highThreshold?: number;
}
