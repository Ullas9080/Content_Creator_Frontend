import { create } from 'zustand';
import api from '@/lib/api';

interface SocialAccountState {
  youtubeChannelName?: string;
  youtubeChannelId?: string;
  instagramHandle?: string;
  xHandle?: string;
  isLoading: boolean;
  refresh: () => Promise<void>;
  clear: () => void;
}

export const useSocialAccountStore = create<SocialAccountState>((set) => ({
  youtubeChannelName: undefined,
  youtubeChannelId: undefined,
  instagramHandle: undefined,
  xHandle: undefined,
  isLoading: false,

  refresh: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/auth/me');
      set({
        youtubeChannelName: response.data?.youtubeChannelName,
        youtubeChannelId: response.data?.youtubeChannelId,
        instagramHandle: response.data?.instagramHandle,
        xHandle: response.data?.xHandle,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  clear: () =>
    set({
      youtubeChannelName: undefined,
      youtubeChannelId: undefined,
      instagramHandle: undefined,
      xHandle: undefined,
      isLoading: false,
    }),
}));
