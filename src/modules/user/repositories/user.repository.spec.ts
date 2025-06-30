// src/repositories/__tests__/user.repository.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { User } from '@prisma/client';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: jest.Mocked<PrismaService>;

  const mockUser: User = {
    id: 'uuid-123',
    email: 'test@example.com',
    password: 'hashedPassword',
    username: 'testuser',
    isAdmin: false,
    provider: 'EMAIL',
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: null,
    lastName: null,
    phone: null,
    photoUrl: null,
    dateOfBirth: null,
    country: null,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
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
    it('should call prisma.user.findUnique with email', async function (this: void) {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await repository.findByEmail(mockUser.email);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should call prisma.user.create with user data', async function (this: void) {
      (prisma.user.create as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await repository.create({
        email: mockUser.email,
        password: mockUser.password,
        username: mockUser.username ?? undefined,
        provider: mockUser.provider,
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: mockUser.email,
          password: mockUser.password,
          username: mockUser.username ?? undefined,
          provider: mockUser.provider,
        },
      });

      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should find a user by id', async function (this: void) {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await repository.findById(mockUser.id);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async function (this: void) {
      (prisma.user.findMany as jest.Mock).mockResolvedValueOnce([mockUser]);

      const result = await repository.findAll();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('update', () => {
    it('should call prisma.user.update with correct data', async function (this: void) {
      (prisma.user.update as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await repository.update(mockUser.id, {
        username: 'updated',
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { username: 'updated' },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('delete', () => {
    it('should call prisma.user.delete with id', async function (this: void) {
      (prisma.user.delete as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(repository.delete(mockUser.id)).resolves.toBeUndefined();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });
  });
});
