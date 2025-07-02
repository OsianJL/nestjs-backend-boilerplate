import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserProfile } from '@prisma/client';
import { AuthRequest } from 'src/shared/interfaces/auth-request.interface';

describe('UserProfileController', () => {
  let controller: UserProfileController;
  let service: jest.Mocked<UserProfileService>;

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

  const mockRequest = {
    user: {
      userId: 'user-uuid-123',
      isAdmin: false,
    },
  } as AuthRequest;

  const mockAdminRequest = {
    user: {
      userId: 'admin-uuid',
      isAdmin: true,
    },
  } as AuthRequest;

  beforeEach(async () => {
    const mockUserProfileService = {
      createProfile: jest.fn().mockResolvedValue(mockUserProfile),
      getProfileById: jest.fn().mockResolvedValue(mockUserProfile),
      getProfileByUserId: jest.fn().mockResolvedValue(mockUserProfile),
      getAllProfiles: jest.fn().mockResolvedValue([mockUserProfile]),
      updateProfile: jest.fn().mockResolvedValue(mockUserProfile),
      deleteProfile: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProfileController],
      providers: [
        {
          provide: UserProfileService,
          useValue: mockUserProfileService,
        },
      ],
    }).compile();

    controller = module.get<UserProfileController>(UserProfileController);
    service = module.get(UserProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a profile with authenticated user id', async () => {
      const dto = {
        userName: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = await controller.create(dto, mockRequest);

      expect(service.createProfile).toHaveBeenCalledWith({
        ...dto,
        userId: mockRequest.user.userId,
      });
      expect(result).toEqual(mockUserProfile);
    });
  });

  describe('findOne', () => {
    it('should return profile if user is owner', async () => {
      const result = await controller.findOne(mockUserProfile.id, mockRequest);

      expect(service.getProfileById).toHaveBeenCalledWith(mockUserProfile.id);
      expect(result).toEqual(mockUserProfile);
    });

    it('should return profile if user is admin', async () => {
      const result = await controller.findOne(
        mockUserProfile.id,
        mockAdminRequest,
      );

      expect(service.getProfileById).toHaveBeenCalledWith(mockUserProfile.id);
      expect(result).toEqual(mockUserProfile);
    });

    it('should throw ForbiddenException if user is not owner or admin', async () => {
      const unauthorizedRequest = {
        user: {
          userId: 'other-user-id',
          isAdmin: false,
        },
      } as AuthRequest;

      await expect(
        controller.findOne(mockUserProfile.id, unauthorizedRequest),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if profile not found', async () => {
      service.getProfileById.mockResolvedValueOnce(null);

      await expect(
        controller.findOne('non-existent-id', mockRequest),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto = {
      userName: 'newusername',
      bio: 'Updated bio',
    };

    it('should update profile if user is owner', async () => {
      const result = await controller.update(
        mockUserProfile.id,
        updateDto,
        mockRequest,
      );

      expect(service.updateProfile).toHaveBeenCalledWith(
        mockUserProfile.id,
        updateDto,
      );
      expect(result).toEqual(mockUserProfile);
    });

    it('should update profile if user is admin', async () => {
      const result = await controller.update(
        mockUserProfile.id,
        updateDto,
        mockAdminRequest,
      );

      expect(service.updateProfile).toHaveBeenCalledWith(
        mockUserProfile.id,
        updateDto,
      );
      expect(result).toEqual(mockUserProfile);
    });

    it('should throw ForbiddenException if user is not owner or admin', async () => {
      const unauthorizedRequest = {
        user: {
          userId: 'other-user-id',
          isAdmin: false,
        },
      } as AuthRequest;

      await expect(
        controller.update(mockUserProfile.id, updateDto, unauthorizedRequest),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if profile not found', async () => {
      service.getProfileById.mockResolvedValueOnce(null);

      await expect(
        controller.update('non-existent-id', updateDto, mockRequest),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete profile if user is owner', async () => {
      await controller.delete(mockUserProfile.id, mockRequest);

      expect(service.deleteProfile).toHaveBeenCalledWith(mockUserProfile.id);
    });

    it('should delete profile if user is admin', async () => {
      await controller.delete(mockUserProfile.id, mockAdminRequest);

      expect(service.deleteProfile).toHaveBeenCalledWith(mockUserProfile.id);
    });

    it('should throw ForbiddenException if user is not owner or admin', async () => {
      const unauthorizedRequest = {
        user: {
          userId: 'other-user-id',
          isAdmin: false,
        },
      } as AuthRequest;

      await expect(
        controller.delete(mockUserProfile.id, unauthorizedRequest),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if profile not found', async () => {
      service.getProfileById.mockResolvedValueOnce(null);

      await expect(
        controller.delete('non-existent-id', mockRequest),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all profiles if user is admin', async () => {
      const result = await controller.findAll(mockAdminRequest);

      expect(service.getAllProfiles).toHaveBeenCalled();
      expect(result).toEqual([mockUserProfile]);
    });

    it('should throw ForbiddenException if user is not admin', async () => {
      await expect(controller.findAll(mockRequest)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
