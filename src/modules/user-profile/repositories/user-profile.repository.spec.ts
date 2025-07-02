import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileRepository } from './user-profile.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserProfile } from '@prisma/client';

describe('UserProfileRepository', () => {
  let repository: UserProfileRepository;
  let prisma: jest.Mocked<PrismaService>;

  const mockUserProfile: UserProfile = {
    id: 'profile-uuid-123',
    userName: null,
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
    userId: 'user-uuid-123',
  };

  beforeEach(async () => {
    const mockPrismaService = {
      userProfile: {
        create: jest.fn().mockResolvedValue(mockUserProfile),
        findUnique: jest.fn().mockResolvedValue(mockUserProfile),
        findMany: jest.fn().mockResolvedValue([mockUserProfile]),
        update: jest.fn().mockResolvedValue(mockUserProfile),
        delete: jest.fn().mockResolvedValue(undefined),
      },
    } as unknown as jest.Mocked<PrismaService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProfileRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get(UserProfileRepository);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a user profile', async () => {
      const createDto = {
        userId: mockUserProfile.userId,
        userName: mockUserProfile.userName as string | undefined,
        firstName: mockUserProfile.firstName as string | undefined,
        lastName: mockUserProfile.lastName as string | undefined,
        photoUrl: mockUserProfile.photoUrl as string | undefined,
        phone: mockUserProfile.phone as string | undefined,
        country: mockUserProfile.country as string | undefined,
        dateOfBirth: mockUserProfile.dateOfBirth as Date | undefined,
        language: mockUserProfile.language as string | undefined,
        timezone: mockUserProfile.timezone as string | undefined,
        bio: mockUserProfile.bio as string | undefined,
        receiveNotifications: mockUserProfile.receiveNotifications,
        showEmail: mockUserProfile.showEmail,
      };

      const result = await repository.create(createDto);

      const { userId, ...dataWithoutUserId } = createDto;
      expect(prisma.userProfile.create).toHaveBeenCalledWith({
        data: {
          ...dataWithoutUserId,
          user: { connect: { id: userId } },
        },
      });
      expect(result).toEqual(mockUserProfile);
    });

    it('should throw error if userId is not provided', async () => {
      const createDto = {
        userName: mockUserProfile.userName as string | undefined,
        firstName: mockUserProfile.firstName as string | undefined,
        lastName: mockUserProfile.lastName as string | undefined,
      };

      await expect(repository.create(createDto)).rejects.toThrow(
        'userId is required to create a profile',
      );
    });
  });

  describe('findById', () => {
    it('should find a profile by id', async () => {
      const result = await repository.findById(mockUserProfile.id);

      expect(prisma.userProfile.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserProfile.id },
      });
      expect(result).toEqual(mockUserProfile);
    });
  });

  describe('findByUserId', () => {
    it('should find a profile by userId', async () => {
      const result = await repository.findByUserId(mockUserProfile.userId);

      expect(prisma.userProfile.findUnique).toHaveBeenCalledWith({
        where: { userId: mockUserProfile.userId },
      });
      expect(result).toEqual(mockUserProfile);
    });
  });

  describe('update', () => {
    it('should update a profile', async () => {
      const updateDto = {
        userName: 'newusername',
        bio: 'Updated bio',
      };

      const result = await repository.update(mockUserProfile.id, updateDto);

      expect(prisma.userProfile.update).toHaveBeenCalledWith({
        where: { id: mockUserProfile.id },
        data: updateDto,
      });
      expect(result).toEqual(mockUserProfile);
    });
  });

  describe('delete', () => {
    it('should delete a profile', async () => {
      await repository.delete(mockUserProfile.id);

      expect(prisma.userProfile.delete).toHaveBeenCalledWith({
        where: { id: mockUserProfile.id },
      });
    });
  });

  describe('findAll', () => {
    it('should return all profiles', async () => {
      const result = await repository.findAll();

      expect(prisma.userProfile.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockUserProfile]);
    });
  });
});
