// src/modules/auth/auth.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/auth.dto';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn(),
    };

    const mockUserService = {
      findByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get(AuthService);
    jwtService = module.get(JwtService);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'plaintext',
    };

    const mockUser: User = {
      id: 'uuid-123',
      email: loginDto.email,
      password: '', // hashed version to be set in test
      isAdmin: false,
      isActive: true,
      isVerified: false,
      userRole: 'user',
      provider: 'EMAIL',
      lastLogin: null,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return a JWT token if credentials are valid', async function (this: void) {
      const hashed = await bcrypt.hash(loginDto.password, 10);
      userService.findByEmail.mockResolvedValueOnce({
        ...mockUser,
        password: hashed,
      });
      jwtService.sign.mockReturnValueOnce('mocked.jwt.token');

      const token = await service.validateUser(loginDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        isAdmin: mockUser.isAdmin,
      });
      expect(token).toBe('mocked.jwt.token');
    });

    it('should throw UnauthorizedException if user is not found', async function (this: void) {
      userService.findByEmail.mockResolvedValueOnce(null);

      await expect(service.validateUser(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async function (this: void) {
      const wrongHash = await bcrypt.hash('wrongpass', 10);
      userService.findByEmail.mockResolvedValueOnce({
        ...mockUser,
        password: wrongHash,
      });

      await expect(service.validateUser(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
