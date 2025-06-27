// src/modules/user/user.controller.ts

import {
  Body,
  Controller,
  Post,
  Patch,
  BadRequestException,
  Get,
  NotFoundException,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserInterface } from 'src/interfaces/user.interface';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from 'src/interfaces/auth-request.interface';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiBadRequestResponse({
    description: 'Invalid input or user already exists',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserInterface> {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('User could not be created');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users (protected)' })
  @ApiOkResponse({ description: 'List of all users' })
  async findAll(@Req() req: AuthRequest): Promise<UserInterface[]> {
    console.log('Usuario autenticado:', req.user); // contiene: userId, email, isAdmin
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiOkResponse({ description: 'User found' })
  @ApiBadRequestResponse({ description: 'Invalid ID format' })
  async findOne(@Param('id') id: string): Promise<UserInterface> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data or ID' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserInterface> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid ID or user not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
