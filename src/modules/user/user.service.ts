import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/repositories/user.repository';
import { UserInterface } from 'src/interfaces/user.interface';
import { CreateUserInput } from 'src/interfaces/create-user.input';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(data: CreateUserInput): Promise<UserInterface> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.userRepo.create({
      ...data,
      password: hashedPassword,
    });
  }

  async findByEmail(email: string): Promise<UserInterface | null> {
    return this.userRepo.findByEmail(email);
  }
}
