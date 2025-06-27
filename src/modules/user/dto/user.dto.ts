import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
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
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
