import { IsString, IsNotEmpty, MinLength, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'leader001' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '张三', required: false })
  @IsString()
  @IsOptional()
  realName?: string;

  @ApiProperty({ example: '13800138000', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ enum: ['ADMIN', 'FINANCE', 'LEADER'], required: false })
  @IsEnum(['ADMIN', 'FINANCE', 'LEADER'])
  @IsOptional()
  role?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  teamId?: number;
}
