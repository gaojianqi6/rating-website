import api from "@/lib/api";

export const login = (username: string, password: string) => api.post('auth/login', {
  json: { username, password }
}).json();

export const getProfile = () => api.get('users/profile').json();