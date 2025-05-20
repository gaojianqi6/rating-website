// app/store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProfile } from '@/api/user';
import { toLogin } from '@/utils/auth';

interface User {
  id: number;
  username: string;
  // Add other user properties as needed
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      fetchUser: async () => {
        set({ loading: true, error: null });
        try {
          const profile = await getProfile() as User;
          set({ user: profile, loading: false });
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch profile', 
            loading: false 
          });
        }
      },
      logout: () => {
        set({ user: null });
        toLogin();
      },
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'user-storage', // unique name for localStorage key
      partialize: (state) => ({ user: state.user }), // only persist user data
    }
  )
);