import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/user.dto';
import { User } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let userRepo: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should hash password and call userRepo.create()', async function (this: void) {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'plaintext',
      };

      const hashed = await bcrypt.hash(dto.password, 10);
      const mockUser: User = {
        id: 'uuid-123',
        email: dto.email,
        password: hashed,
        provider: 'EMAIL',
        isAdmin: false,
        isActive: true,
        isVerified: false,
        userRole: 'user',
        lastLogin: null,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      userRepo.create.mockResolvedValueOnce(mockUser);

      const result = await service.createUser(dto);

      expect(userRepo.create).toHaveBeenCalledWith({
        ...dto,
        password: expect.any(String) as string,
      });

      expect(result).toEqual(mockUser);
    });
  });
});
