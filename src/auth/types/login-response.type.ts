import { User } from '../../users/domain/user';

export type LoginResponseType = {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: User;
  message: string;
};
