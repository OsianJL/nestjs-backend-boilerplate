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

  async getAllUsers(): Promise<UserInterface[]> {
    return this.userRepo.findAll();
  }

  async getUserById(id: string): Promise<UserInterface | null> {
    return this.userRepo.findById(id);
  }

  async updateUser(
    id: string,
    data: Partial<UserInterface>,
  ): Promise<UserInterface> {
    return this.userRepo.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }
}
