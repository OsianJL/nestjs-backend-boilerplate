import { Injectable } from '@nestjs/common';
import { PrismaClient, Provider } from '../../generated/prisma';
import { UserInterface } from '../interfaces/user.interface';
import { CreateUserInput } from '../interfaces/create-user.input';

@Injectable()
export class UserRepository {
  private prisma = new PrismaClient();

  async create(data: CreateUserInput): Promise<UserInterface> {
    const createdUser = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        username: data.username,
        provider: data.provider ?? Provider.EMAIL,
      },
    });
    return createdUser;
  }

  async findByEmail(email: string): Promise<UserInterface | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
