import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
    findByEmail: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  } as Partial<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
