// src/interfaces/user.interface.ts

export type Provider = 'EMAIL' | 'GOOGLE' | 'APPLE';
export type UserRole = 'user' | 'admin' | 'moderator';

export interface UserInterface {
  id: string;
  email: string;
  password: string;
  provider: Provider;
  isAdmin: boolean;
  isActive: boolean;
  isVerified: boolean;
  userRole: UserRole;
  lastLogin?: Date | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userProfile?: import('./user-profile.interface').UserProfileInterface | null;
}
