export interface IUserData {
  access_token: string;
  access_token_expires_at: string;
  refresh_token: string;
  refresh_token_expires_at: string;
  user: IUser;
}

export interface IUser {
  id: number;
  full_name: string;
  email: string;
  role: IUserRole;
  created_at: string;
}

export interface ICurrentUser {
  user_id: number;
  full_name: string;
  email: string;
  role: IUserRole;
}

export enum IUserRole {
  user = 0,
  admin = 1,
}
