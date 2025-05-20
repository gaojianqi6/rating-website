import api from "@/lib/api";
import { User } from "@/types/user";

export const login = (username: string, password: string) => api.post('auth/login', {
  json: { username, password }
}).json();

export const getProfile = () => api.get('users/profile').json();
export const getRatings = () => api.get('users/ratings').json();

export const updateProfile = (userId: number, user: object): Promise<User> =>
  api.patch(`users/${userId}`, { json: user }).json();

export const changePassword = (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<User> =>
  api.post('users/change-password', {
    json: { oldPassword, newPassword, confirmPassword }
  }).json();

export const registerUser = ({
  username,
  password,
  confirmPassword,
  email
}: {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}): Promise<User> =>
  api.post('auth/register', {
    json: { username, password, confirmPassword, email }
  }).json();