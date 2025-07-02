import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import 'reflect-metadata';
import { UserRole } from '@prisma/client';

// DTO mínimo del perfil para anidarlo desde User
export class UserProfileDto {
  @ApiPropertyOptional({ example: 'Ada' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Lovelace' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: '+34600111222' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Spain' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  language?: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'securepassword' })
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ enum: ['EMAIL', 'GOOGLE', 'APPLE'] })
  @IsOptional()
  @IsIn(['EMAIL', 'GOOGLE', 'APPLE'])
  provider?: 'EMAIL' | 'GOOGLE' | 'APPLE';

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional({ example: 'user' })
  @IsOptional()
  @IsIn(['user', 'admin', 'moderator'])
  userRole?: UserRole;

  @ApiPropertyOptional({ type: () => UserProfileDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserProfileDto)
  userProfile?: UserProfileDto;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
