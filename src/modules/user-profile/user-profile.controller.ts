import {
  Body,
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserProfileInterface } from 'src/shared/interfaces/user-profile.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import type { AuthRequest } from 'src/shared/interfaces/auth-request.interface';

@ApiTags('user-profiles')
@Controller('user-profiles')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Create user profile' })
  @ApiCreatedResponse({ description: 'User profile created successfully' })
  async create(
    @Body() dto: UserProfileDto,
    @Req() req: AuthRequest,
  ): Promise<UserProfileInterface> {
    // Forzar que el userId sea el del usuario autenticado
    return this.userProfileService.createProfile({
      ...dto,
      userId: req.user.userId,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiOkResponse({ description: 'User profile found' })
  async findOne(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<UserProfileInterface> {
    const profile = await this.userProfileService.getProfileById(id);
    if (!profile) throw new NotFoundException('Profile not found');
    // Solo el dueño o admin puede ver
    if (req.user.userId !== profile.userId && !req.user.isAdmin) {
      throw new ForbiddenException('Not authorized');
    }
    return profile;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update user profile by ID' })
  @ApiOkResponse({ description: 'User profile updated' })
  async update(
    @Param('id') id: string,
    @Body() dto: UserProfileDto,
    @Req() req: AuthRequest,
  ): Promise<UserProfileInterface> {
    const profile = await this.userProfileService.getProfileById(id);
    if (!profile) throw new NotFoundException('Profile not found');
    if (req.user.userId !== profile.userId && !req.user.isAdmin) {
      throw new ForbiddenException('Not authorized');
    }
    return this.userProfileService.updateProfile(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Delete user profile by ID' })
  @ApiOkResponse({ description: 'User profile deleted' })
  async delete(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<void> {
    const profile = await this.userProfileService.getProfileById(id);
    if (!profile) throw new NotFoundException('Profile not found');
    if (req.user.userId !== profile.userId && !req.user.isAdmin) {
      throw new ForbiddenException('Not authorized');
    }
    await this.userProfileService.deleteProfile(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get all user profiles (admin only)' })
  @ApiOkResponse({ description: 'List of user profiles' })
  async findAll(@Req() req: AuthRequest): Promise<UserProfileInterface[]> {
    if (!req.user.isAdmin) throw new ForbiddenException('Admin only');
    return this.userProfileService.getAllProfiles();
  }
}
