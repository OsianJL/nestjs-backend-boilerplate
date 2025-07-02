import { Injectable } from '@nestjs/common';
import { UserProfileRepository } from './repositories/user-profile.repository';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserProfileInterface } from 'src/shared/interfaces/user-profile.interface';

@Injectable()
export class UserProfileService {
  constructor(private readonly userProfileRepo: UserProfileRepository) {}

  async createProfile(data: UserProfileDto): Promise<UserProfileInterface> {
    return this.userProfileRepo.create(data);
  }

  async getProfileById(id: string): Promise<UserProfileInterface | null> {
    return this.userProfileRepo.findById(id);
  }

  async getProfileByUserId(
    userId: string,
  ): Promise<UserProfileInterface | null> {
    return this.userProfileRepo.findByUserId(userId);
  }

  async updateProfile(
    id: string,
    data: Partial<UserProfileDto>,
  ): Promise<UserProfileInterface> {
    return this.userProfileRepo.update(id, data);
  }

  async deleteProfile(id: string): Promise<void> {
    await this.userProfileRepo.delete(id);
  }

  async getAllProfiles(): Promise<UserProfileInterface[]> {
    return this.userProfileRepo.findAll();
  }
}
