import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new user.
   */
  async create(data: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        provider: data.provider ?? 'EMAIL',

        // Flags & role
        isAdmin: data.isAdmin ?? false,
        isActive: data.isActive ?? true,
        isVerified: data.isVerified ?? false,
        userRole: data.userRole ?? UserRole.user,

        // Always create a profile, either with provided data or empty
        userProfile: {
          create: data.userProfile ?? {
            receiveNotifications: true,
            showEmail: false,
          },
        },
      },
      // Include the profile in the response
      include: {
        userProfile: true,
      },
    });
  }

  /**
   * Find a user by email.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Retrieve all users.
   */
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  /**
   * Find a user by ID.
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Update user data.
   * Extra guards can be added in the service layer (e.g. forbid changing
   * `password` or `provider` here directly).
   */
  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        userRole: data.userRole ?? undefined,
        userProfile: data.userProfile
          ? {
              upsert: {
                create: { ...data.userProfile },
                update: { ...data.userProfile },
              },
            }
          : undefined,
      },
    });
  }

  /**
   * Soft-delete pattern could be used here; for now we hard-delete.
   */
  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  /**
   * Convenience: fetch user by reset token (for password recovery flows).
   */
  async findByResetToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });
  }

  /**
   * Update last-login timestamp.
   */
  async touchLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }
}
