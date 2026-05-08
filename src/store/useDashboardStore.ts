import { create } from 'zustand';
import { graphqlRequest } from '@/lib/api';

interface DashboardStats {
  youtubeSubscribers: string;
  youtubeViews: string;
  totalRevenue: number;
  activeBrandDeals: number;
  aiSuggestions: any[];
}

interface DashboardState {
  stats: DashboardStats | null;
  platformSplit: {
    youtubeSubscribers: string;
    youtubeViews: string;
  } | null;
  revenueEntries: Array<{ month: string; total: number }>;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  platformSplit: null,
  revenueEntries: [],
  isLoading: false,
  error: null,
  lastFetchedAt: null,

  fetchDashboardData: async () => {
    const { lastFetchedAt } = useDashboardStore.getState();
    const now = Date.now();
    if (lastFetchedAt && now - lastFetchedAt < 60_000) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const [dashboardData, revenueData, youtubeData] = await Promise.all([
        graphqlRequest<{ dashboardStats: { totalAudience: string; pendingRevenue: string; activeCollabs: number; avgEngagement: string } }>(`
          query {
            dashboardStats {
              totalAudience
              pendingRevenue
              activeCollabs
              avgEngagement
            }
          }
        `).catch(() => null),
        graphqlRequest<{ revenueEntries: Array<{ month: string; total: number }> }>(`
          query {
            revenueEntries {
              month
              total
            }
          }
        `).catch(() => null),
        graphqlRequest<{ youtubeChannelData: { subscriberCount?: string; viewCount?: string } }>(`
          query {
            youtubeChannelData {
              subscriberCount
              viewCount
            }
          }
        `).catch(() => null),
      ]);
      
      set({ 
        stats: {
          youtubeSubscribers: youtubeData?.youtubeChannelData?.subscriberCount || '0',
          youtubeViews: youtubeData?.youtubeChannelData?.viewCount || '0',
          totalRevenue: Number(revenueData?.revenueEntries?.reduce((sum, item) => sum + Number(item.total || 0), 0) || 0),
          activeBrandDeals: Number(dashboardData?.dashboardStats?.activeCollabs || 0),
          aiSuggestions: [],
        },
        platformSplit: {
          youtubeSubscribers: youtubeData?.youtubeChannelData?.subscriberCount || '0',
          youtubeViews: youtubeData?.youtubeChannelData?.viewCount || '0',
        },
        revenueEntries: revenueData?.revenueEntries || [],
        isLoading: false,
        lastFetchedAt: now,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
