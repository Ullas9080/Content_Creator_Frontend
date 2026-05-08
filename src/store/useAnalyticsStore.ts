import { create } from 'zustand';
import { graphqlRequest } from '@/lib/api';

interface YoutubeVideo {
  videoId: string;
  title: string;
  thumbnail?: string;
  publishedAt?: string;
  views: string;
  likes: string;
  comments: string;
}

interface AnalyticsState {
  youtubeVideos: YoutubeVideo[];
  youtubeChannel: any | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  fetchYoutubeAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  youtubeVideos: [],
  youtubeChannel: null,
  isLoading: false,
  error: null,
  lastFetchedAt: null,

  fetchYoutubeAnalytics: async () => {
    const { lastFetchedAt } = useAnalyticsStore.getState();
    const now = Date.now();
    if (lastFetchedAt && now - lastFetchedAt < 60_000) return;

    set({ isLoading: true, error: null });
    try {
      // Check cache/localStorage first for videos as requested
      const cachedVideos = localStorage.getItem('youtubeTopVideos');
      if (cachedVideos) {
        set({ youtubeVideos: JSON.parse(cachedVideos) });
      }

      // GraphQL query for analytics
      const data = await graphqlRequest<{
        youtubeChannelData: any;
        youtubeTopVideos: YoutubeVideo[];
      }>(`
          query {
            youtubeChannelData {
              channelName
              channelId
              subscriberCount
              viewCount
              videoCount
              thumbnail
              description
            }
            youtubeTopVideos {
              videoId
              title
              thumbnail
              publishedAt
              views
              likes
              comments
              duration
            }
          }
        `);

      if (data) {
        if (data.youtubeTopVideos) {
            set({ youtubeVideos: data.youtubeTopVideos });
            localStorage.setItem('youtubeTopVideos', JSON.stringify(data.youtubeTopVideos));
        }
        if (data.youtubeChannelData) {
            set({ youtubeChannel: data.youtubeChannelData });
        }
      }
      set({ isLoading: false, lastFetchedAt: now });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
