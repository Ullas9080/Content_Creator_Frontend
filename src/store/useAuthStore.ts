import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { authToken } from '@/lib/auth-token';

interface User {
  _id: string;
  email: string;
  displayName: string;
  photo?: string;
  youtubeChannelName?: string;
  youtubeChannelId?: string;
  instagramHandle?: string;
  xHandle?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  hydrated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  loginWithToken: (token: string) => Promise<void>;
  loginWithCredentials: (email: string, password: string, displayName?: string, isSignUp?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  hydrateAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hydrated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        if (token) authToken.set(token);
        else authToken.clear();
        set({ token });
      },

      loginWithToken: async (token) => {
        set({ isLoading: true, error: null });
        try {
          authToken.set(token);
          set({ token, isAuthenticated: true });
          const response = await api.get('/auth/me');
          set({ user: response.data, isLoading: false, hydrated: true });
        } catch (err: any) {
          authToken.clear();
          set({ error: err.message, isLoading: false, isAuthenticated: false, token: null, hydrated: true });
        }
      },

      loginWithCredentials: async (email, password, displayName, isSignUp = false) => {
        set({ isLoading: true, error: null });
        try {
          const endpoint = isSignUp ? '/auth/register' : '/auth/login';
          const payload = isSignUp ? { email, password, displayName } : { email, password };
          const response = await api.post(endpoint, payload);
          const token = response.data?.token as string;
          if (!token) {
            throw new Error('Missing auth token');
          }
          authToken.set(token);
          set({ token, isAuthenticated: true });
          const me = await api.get('/auth/me');
          set({ user: me.data, isLoading: false, hydrated: true });
        } catch (err: any) {
          authToken.clear();
          set({ error: err.message || 'Authentication failed', isLoading: false, isAuthenticated: false, token: null, hydrated: true });
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {
          // Ignore, client-side cleanup still applies.
        }
        authToken.clear();
        set({ user: null, token: null, isAuthenticated: false, hydrated: true });
      },

      fetchMe: async () => {
        const token = authToken.get();
        set({ isLoading: true });
        try {
          const response = await api.get('/auth/me');
          set({ user: response.data, isAuthenticated: true, token, isLoading: false, hydrated: true });
        } catch (err: any) {
          authToken.clear();
          set({ user: null, isAuthenticated: false, token: null, isLoading: false, hydrated: true });
        }
      },

      hydrateAuth: async () => {
        await useAuthStore.getState().fetchMe();
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }), // Only persist token
    }
  )
);
