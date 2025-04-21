import type { User } from './user.interface';

export interface RegisterResponse {
  user: User;
  token: string;
}
