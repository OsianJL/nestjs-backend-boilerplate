import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserProfile } from '@prisma/client';
import { UserProfileDto } from '../dto/user-profile.dto';

@Injectable()
export class UserProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: UserProfileDto): Promise<UserProfile> {
    const { userId, ...profileData } = data;
    if (!userId) {
      throw new Error('userId is required to create a profile');
    }
    return await this.prisma.userProfile.create({
      data: {
        ...profileData,
        user: { connect: { id: userId } },
      },
    });
  }

  async findById(id: string): Promise<UserProfile | null> {
    return await this.prisma.userProfile.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<UserProfile | null> {
    return await this.prisma.userProfile.findUnique({ where: { userId } });
  }

  async update(
    id: string,
    data: Partial<UserProfileDto>,
  ): Promise<UserProfile> {
    return await this.prisma.userProfile.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.userProfile.delete({ where: { id } });
  }

  async findAll(): Promise<UserProfile[]> {
    return await this.prisma.userProfile.findMany();
  }
}
