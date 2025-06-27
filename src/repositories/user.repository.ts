import { Injectable } from '@nestjs/common';
import { PrismaClient, Provider } from '@prisma/client';
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

  async findAll(): Promise<UserInterface[]> {
    return this.prisma.user.findMany();
  }
  async findById(id: string): Promise<UserInterface | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
  async update(
    id: string,
    data: Partial<UserInterface>,
  ): Promise<UserInterface> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
