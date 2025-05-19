export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  password: string;
  avatar: string;
  description: string;
  country: string;
  googleId: string | null;
  loggedInAt: string | null;
  createdAt: string;
  updatedAt: string;
}
