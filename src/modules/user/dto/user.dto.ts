import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import 'reflect-metadata';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'securepassword' })
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ example: 'osian' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ enum: ['EMAIL', 'GOOGLE', 'APPLE'] })
  @IsOptional()
  @IsIn(['EMAIL', 'GOOGLE', 'APPLE'])
  provider?: 'EMAIL' | 'GOOGLE' | 'APPLE';
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
