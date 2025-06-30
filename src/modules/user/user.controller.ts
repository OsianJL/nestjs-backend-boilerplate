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
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import type { AuthRequest } from 'src/shared/interfaces/auth-request.interface';
import type { UserInterface } from 'src/shared/interfaces/user.interface';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //create user
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
  //get all users
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users (protected)' })
  @ApiOkResponse({ description: 'List of all users' })
  async findAll(@Req() req: AuthRequest): Promise<UserInterface[]> {
    console.log('Authenticated user:', req.user);
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get user by ID (self or admin)' })
  @ApiOkResponse({ description: 'User found' })
  @ApiBadRequestResponse({ description: 'Invalid ID format' })
  async findOne(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<UserInterface> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const requester = req.user;
    const isSelf = requester.userId === id;
    const isAdmin = requester.isAdmin;

    if (!isSelf && !isAdmin) {
      throw new ForbiddenException('You are not authorized to view this user');
    }

    return user;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update user by ID (self or admin)' })
  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data or ID' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: AuthRequest,
  ): Promise<UserInterface> {
    const requester = req.user;
    const isSelf = requester.userId === id;
    const isAdmin = requester.isAdmin;

    if (!isSelf && !isAdmin) {
      throw new ForbiddenException(
        'You are not authorized to update this user',
      );
    }

    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Delete user by ID (self or admin)' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data or ID' })
  async delete(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<void> {
    const requester = req.user;
    const isSelf = requester.userId === id;
    const isAdmin = requester.isAdmin;

    if (!isSelf && !isAdmin) {
      throw new ForbiddenException(
        'You are not authorized to delete this user',
      );
    }

    return this.userService.deleteUser(id);
  }
}
