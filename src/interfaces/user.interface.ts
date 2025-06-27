// src/interfaces/user.interface.ts

export interface UserInterface {
  id: string;
  email: string;
  password: string;
  isAdmin: boolean;
  provider: 'EMAIL' | 'GOOGLE' | 'APPLE';
  createdAt: Date;
  updatedAt: Date;

  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
  dateOfBirth?: Date | null;
  country?: string | null;
}
