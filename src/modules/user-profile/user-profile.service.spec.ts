import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileService } from './user-profile.service';
import { UserProfileRepository } from './repositories/user-profile.repository';
import { UserProfile } from '@prisma/client';
import { UserProfileDto } from './dto/user-profile.dto';

describe('UserProfileService', () => {
  let service: UserProfileService;
  let userProfileRepo: jest.Mocked<UserProfileRepository>;

  const mockUserProfile: UserProfile = {
    id: 'profile-uuid-123',
    userName: 'testuser',
    firstName: 'John',
    lastName: 'Doe',
    photoUrl: 'https://example.com/photo.jpg',
    phone: '1234567890',
    country: 'TestLand',
    dateOfBirth: new Date('1990-01-01'),
    language: 'en',
    timezone: 'UTC',
    bio: 'Test bio',
    receiveNotifications: true,
    showEmail: false,
    userId: 'user-uuid-123',
  };

  beforeEach(async () => {
    const mockUserProfileRepository = {
      create: jest.fn().mockResolvedValue(mockUserProfile),
      findById: jest.fn().mockResolvedValue(mockUserProfile),
      findByUserId: jest.fn().mockResolvedValue(mockUserProfile),
      findAll: jest.fn().mockResolvedValue([mockUserProfile]),
      update: jest.fn().mockResolvedValue(mockUserProfile),
      delete: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProfileService,
        {
          provide: UserProfileRepository,
          useValue: mockUserProfileRepository,
        },
      ],
    }).compile();

    service = module.get<UserProfileService>(UserProfileService);
    userProfileRepo = module.get(UserProfileRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProfile', () => {
    it('should create a profile', async () => {
      const dto: UserProfileDto = {
        userId: 'user-uuid-123',
        userName: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = await service.createProfile(dto);

      expect(userProfileRepo.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUserProfile);
    });
  });

  describe('getProfileById', () => {
    it('should return a profile by id', async () => {
      const result = await service.getProfileById(mockUserProfile.id);

      expect(userProfileRepo.findById).toHaveBeenCalledWith(mockUserProfile.id);
      expect(result).toEqual(mockUserProfile);
    });
  });

  describe('getProfileByUserId', () => {
    it('should return a profile by userId', async () => {
      const result = await service.getProfileByUserId(mockUserProfile.userId);

      expect(userProfileRepo.findByUserId).toHaveBeenCalledWith(
        mockUserProfile.userId,
      );
      expect(result).toEqual(mockUserProfile);
    });
  });

  describe('updateProfile', () => {
    it('should update a profile', async () => {
      const updateDto: Partial<UserProfileDto> = {
        userName: 'newusername',
        bio: 'Updated bio',
      };

      const result = await service.updateProfile(mockUserProfile.id, updateDto);

      expect(userProfileRepo.update).toHaveBeenCalledWith(
        mockUserProfile.id,
        updateDto,
      );
      expect(result).toEqual(mockUserProfile);
    });
  });

  describe('deleteProfile', () => {
    it('should delete a profile', async () => {
      await service.deleteProfile(mockUserProfile.id);

      expect(userProfileRepo.delete).toHaveBeenCalledWith(mockUserProfile.id);
    });
  });

  describe('getAllProfiles', () => {
    it('should return all profiles', async () => {
      const result = await service.getAllProfiles();

      expect(userProfileRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUserProfile]);
    });
  });
});
