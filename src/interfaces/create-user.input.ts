// src/interfaces/create-user.input.ts

export interface CreateUserInput {
  email: string;
  password: string;
  username?: string;
  provider?: 'EMAIL' | 'GOOGLE' | 'APPLE';
}
