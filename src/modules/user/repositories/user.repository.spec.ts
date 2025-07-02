// src/repositories/__tests__/user.repository.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { User, UserProfile } from '@prisma/client';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: jest.Mocked<PrismaService>;

  const mockUserProfile: UserProfile = {
    id: 'profile-uuid-123',
    firstName: null,
    lastName: null,
    photoUrl: null,
    phone: null,
    country: null,
    dateOfBirth: null,
    language: null,
    timezone: null,
    bio: null,
    receiveNotifications: true,
    showEmail: false,
    userId: 'uuid-123',
    userName: null,
  };

  const mockUser: User & { userProfile: UserProfile } = {
    id: 'uuid-123',
    email: 'test@example.com',
    password: 'hashedPassword',
    isAdmin: false,
    provider: 'EMAIL',
    isActive: true,
    isVerified: false,
    userRole: 'user',
    lastLogin: null,
    resetToken: null,
    resetTokenExpiry: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    userProfile: mockUserProfile,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        create: jest.fn().mockResolvedValue(mockUser),
        findUnique: jest.fn().mockResolvedValue(mockUser),
        findMany: jest.fn().mockResolvedValue([mockUser]),
        update: jest.fn().mockResolvedValue(mockUser),
        delete: jest.fn().mockResolvedValue(undefined),
        findFirst: jest.fn().mockResolvedValue(mockUser),
      },
    } as unknown as jest.Mocked<PrismaService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get(UserRepository);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should call prisma.user.findUnique with email', async () => {
      const result = await repository.findByEmail(mockUser.email);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create a user with an empty profile when no profile is provided', async () => {
      const result = await repository.create({
        email: mockUser.email,
        password: mockUser.password,
      });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: mockUser.email,
          password: mockUser.password,
          provider: 'EMAIL',
          isAdmin: false,
          isActive: true,
          isVerified: false,
          userRole: 'user',
          userProfile: {
            create: {
              receiveNotifications: true,
              showEmail: false,
            },
          },
        },
        include: {
          userProfile: true,
        },
      });

      expect(result).toEqual(mockUser);
    });

    it('should create a user with provided profile data', async () => {
      const userWithCustomProfile = {
        ...mockUser,
        userProfile: {
          ...mockUserProfile,
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      (prisma.user.create as jest.Mock).mockResolvedValueOnce(
        userWithCustomProfile,
      );

      const result = await repository.create({
        email: mockUser.email,
        password: mockUser.password,
        userProfile: {
          firstName: 'John',
          lastName: 'Doe',
        },
      });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: mockUser.email,
          password: mockUser.password,
          provider: 'EMAIL',
          isAdmin: false,
          isActive: true,
          isVerified: false,
          userRole: 'user',
          userProfile: {
            create: {
              firstName: 'John',
              lastName: 'Doe',
            },
          },
        },
        include: {
          userProfile: true,
        },
      });

      expect(result).toEqual(userWithCustomProfile);
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const result = await repository.findById(mockUser.id);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const result = await repository.findAll();

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('update', () => {
    it('should call prisma.user.update with correct data', async () => {
      const result = await repository.update(mockUser.id, {
        userRole: 'admin',
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          userRole: 'admin',
          userProfile: undefined,
        },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('delete', () => {
    it('should call prisma.user.delete with id', async () => {
      await expect(repository.delete(mockUser.id)).resolves.toBeUndefined();

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });
  });

  describe('findByResetToken', () => {
    it('should find a user by reset token', async () => {
      const result = await repository.findByResetToken('token123');

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          resetToken: 'token123',
          resetTokenExpiry: { gt: expect.any(Date) as Date },
        },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('touchLastLogin', () => {
    it('should update lastLogin timestamp', async () => {
      await repository.touchLastLogin(mockUser.id);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { lastLogin: expect.any(Date) as Date },
      });
    });
  });
});
