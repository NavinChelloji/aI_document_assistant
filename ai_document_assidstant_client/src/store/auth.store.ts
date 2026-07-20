import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, User } from '../types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user: User, token: string) => 
        set({ user, token, isAuthenticated: true }),
      logout: () => 
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => localStorage),
    }
  )
);
