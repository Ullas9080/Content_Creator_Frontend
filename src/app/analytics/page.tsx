"use client";
import { API_BASE_URL } from '@/config/api';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import RevenueChart from '@/components/dashboard/RevenueChart';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';
import { BarChart3, TrendingUp, Eye, ThumbsUp, MessageCircle } from 'lucide-react';
import { FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa';
import { platforms, performanceData as dummyPerformance, topVideos } from '@/lib/dummy-data';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

interface YoutubeVideo {
  videoId: string;
  title: string;
  thumbnail?: string;
  publishedAt?: string;
  views: string;
  likes: string;
  comments: string;
  duration?: string;
}

interface YoutubeChannel {
  channelName: string;
  channelId: string;
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
  thumbnail?: string;
  description?: string;
}

// Empty Instagram data state
const instagramData = {
  followers: '--',
  reach: '--',
  engagement: '--',
  posts: [],
};

// Empty X (Twitter) data state
const xData = {
  followers: '--',
  impressions: '--',
  engagement: '--',
  tweets: [],
};

export default function AnalyticsPage() {
  const { youtubeChannel, youtubeVideos, isLoading, fetchYoutubeAnalytics } = useAnalyticsStore();
  const [activePlatform, setActivePlatform] = useState<'youtube' | 'instagram' | 'x'>('youtube');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    fetchYoutubeAnalytics();
    setMounted(true);
  }, [fetchYoutubeAnalytics]);

  const performanceData = youtubeVideos.slice(0, 6).map((video, index) => ({
    week: `W${index + 1}`,
    youtube: parseInt(video.views) / 1000 || 0,
    instagram: 0,
    x: 0,
  }));

  const formatNumber = (num: string | number) => {
    const n = typeof num === 'string' ? parseInt(num) : num;
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n.toString();
  };

  const platformTabs = [
    { id: 'youtube' as const, label: 'YouTube', icon: FaYoutube, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/50' },
    { id: 'instagram' as const, label: 'Instagram', icon: FaInstagram, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/50' },
    { id: 'x' as const, label: 'X (Twitter)', icon: FaTwitter, color: 'text-white', bg: 'bg-gray-500/10', border: 'border-gray-500/50' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <BarChart3 size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
          </div>
          <p className="text-gray-400 text-sm">Cross-platform performance across YouTube, Instagram & X.</p>
        </div>

        {/* Platform Tabs */}
        <div className="flex gap-3">
          {platformTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActivePlatform(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activePlatform === tab.id
                  ? `${tab.bg} ${tab.border} border ${tab.color}`
                  : 'bg-white/5 border border-dark-700 text-gray-400 hover:bg-white/10'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* YouTube Tab */}
        {activePlatform === 'youtube' && (
          <>
            {/* YouTube Channel Card */}
            {youtubeChannel && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3 glass-panel p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
                  <div className="flex items-start gap-4">
                    {youtubeChannel.thumbnail && (
                      <img src={youtubeChannel.thumbnail} alt={youtubeChannel.channelName} className="w-20 h-20 rounded-full" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FaYoutube className="text-red-500" size={20} />
                        <h2 className="text-xl font-bold text-white">{youtubeChannel.channelName}</h2>
                      </div>
                      {youtubeChannel.description && (
                        <p className="text-gray-400 text-sm mb-4">{youtubeChannel.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-dark-700">
                  <p className="text-gray-400 text-sm font-medium mb-2">Subscribers</p>
                  <h3 className="text-2xl font-bold text-white">{formatNumber(youtubeChannel.subscriberCount)}</h3>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-dark-700">
                  <p className="text-gray-400 text-sm font-medium mb-2">Total Views</p>
                  <h3 className="text-2xl font-bold text-white">{formatNumber(youtubeChannel.viewCount)}</h3>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-dark-700">
                  <p className="text-gray-400 text-sm font-medium mb-2">Videos</p>
                  <h3 className="text-2xl font-bold text-white">{youtubeChannel.videoCount}</h3>
                </div>
              </div>
            )}

            {/* Top Videos */}
            {youtubeVideos.length > 0 && (
              <div className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-white">Top Performing Videos</h2>
                  <span className="text-xs text-purple-400">{youtubeVideos.length} videos</span>
                </div>
                <div className="space-y-4">
                  {youtubeVideos.map((video, i) => (
                    <div key={video.videoId} className="flex items-center gap-4 p-4 bg-white/3 rounded-xl border border-dark-700 hover:border-dark-600 hover:bg-white/5 transition-all group">
                      <span className="text-lg font-bold text-gray-700 w-6 text-center flex-shrink-0">{i + 1}</span>
                      {video.thumbnail && (
                        <img src={video.thumbnail} alt={video.title} className="w-20 h-11 rounded-lg object-cover flex-shrink-0 bg-dark-700" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">{video.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FaYoutube className="text-red-500" size={12} />
                          <span className="text-[11px] text-gray-500">
                            YouTube · {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString() : 'Unknown'}
                          </span>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-5 text-xs text-gray-400 flex-shrink-0">
                        <span className="flex items-center gap-1"><Eye size={12} /> {formatNumber(video.views)}</span>
                        <span className="flex items-center gap-1"><ThumbsUp size={12} /> {formatNumber(video.likes)}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={12} /> {formatNumber(video.comments)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Instagram Tab */}
        {activePlatform === 'instagram' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3 glass-panel p-6 rounded-2xl border border-pink-500/20 bg-pink-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                    <FaInstagram size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Instagram</h2>
                    <p className="text-gray-400 text-sm">Connect your account for real stats</p>
                  </div>
                </div>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-dark-700">
                <p className="text-gray-400 text-sm font-medium mb-2">Followers</p>
                <h3 className="text-2xl font-bold text-white">{instagramData.followers}</h3>
                <p className="text-xs text-emerald-400 mt-1 flex items-center"><TrendingUp size={12} className="mr-1" /> +2.1k this week</p>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-dark-700">
                <p className="text-gray-400 text-sm font-medium mb-2">Reach</p>
                <h3 className="text-2xl font-bold text-white">{instagramData.reach}</h3>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-dark-700">
                <p className="text-gray-400 text-sm font-medium mb-2">Engagement</p>
                <h3 className="text-2xl font-bold text-white">{instagramData.engagement}</h3>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-base font-bold text-white mb-5">Top Instagram Posts</h2>
              <div className="space-y-4">
                {instagramData.posts.map((post, i) => (
                  <div key={post.id} className="flex items-center gap-4 p-4 bg-white/3 rounded-xl border border-dark-700 hover:border-pink-500/30 hover:bg-white/5 transition-all group">
                    <span className="text-lg font-bold text-gray-700 w-6 text-center flex-shrink-0">{i + 1}</span>
                    <img src={post.thumbnail} alt={post.title} className="w-20 h-11 rounded-lg object-cover flex-shrink-0 bg-dark-700" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-pink-300 transition-colors">{post.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <FaInstagram className="text-pink-500" size={12} />
                        <span className="text-[11px] text-gray-500">Instagram · Reel</span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-5 text-xs text-gray-400 flex-shrink-0">
                      <span className="flex items-center gap-1"><Eye size={12} /> {formatNumber(post.views)}</span>
                      <span className="flex items-center gap-1"><ThumbsUp size={12} /> {formatNumber(post.likes)}</span>
                      <span className="flex items-center gap-1"><MessageCircle size={12} /> {formatNumber(post.comments)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* X (Twitter) Tab */}
        {activePlatform === 'x' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3 glass-panel p-6 rounded-2xl border border-gray-500/20 bg-gray-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center border border-gray-700">
                    <FaTwitter size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">X (Twitter)</h2>
                    <p className="text-gray-400 text-sm">Connect your account for real stats</p>
                  </div>
                </div>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-dark-700">
                <p className="text-gray-400 text-sm font-medium mb-2">Followers</p>
                <h3 className="text-2xl font-bold text-white">{xData.followers}</h3>
                <p className="text-xs text-emerald-400 mt-1 flex items-center"><TrendingUp size={12} className="mr-1" /> +12k this week</p>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-dark-700">
                <p className="text-gray-400 text-sm font-medium mb-2">Impressions</p>
                <h3 className="text-2xl font-bold text-white">{xData.impressions}</h3>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-dark-700">
                <p className="text-gray-400 text-sm font-medium mb-2">Engagement</p>
                <h3 className="text-2xl font-bold text-white">{xData.engagement}</h3>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-base font-bold text-white mb-5">Top Tweets / Threads</h2>
              <div className="space-y-4">
                {xData.tweets.map((tweet, i) => (
                  <div key={tweet.id} className="flex items-center gap-4 p-4 bg-white/3 rounded-xl border border-dark-700 hover:border-gray-500/30 hover:bg-white/5 transition-all group">
                    <span className="text-lg font-bold text-gray-700 w-6 text-center flex-shrink-0">{i + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0 border border-gray-700">
                      <FaTwitter size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-blue-300 transition-colors">{tweet.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <FaTwitter className="text-gray-400" size={12} />
                        <span className="text-[11px] text-gray-500">X · Thread</span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-5 text-xs text-gray-400 flex-shrink-0">
                      <span className="flex items-center gap-1"><Eye size={12} /> {formatNumber(tweet.views)}</span>
                      <span className="flex items-center gap-1"><ThumbsUp size={12} /> {formatNumber(tweet.likes)}</span>
                      <span className="flex items-center gap-1"><MessageCircle size={12} /> {formatNumber(tweet.comments)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-base font-bold text-white mb-1">Cross-Platform Performance</h2>
            <p className="text-xs text-gray-500 mb-5">YouTube data {youtubeVideos.length > 0 ? '(live)' : '(empty)'} · Instagram & X (empty)</p>
            <div className="h-56">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} barSize={10} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2230" vertical={false} />
                    <XAxis dataKey="week" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={v => `${v/1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e2230', borderColor: '#334155', borderRadius: '8px' }} formatter={(v: any) => [`${(v/1000).toFixed(0)}k`]} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                    <Bar dataKey="youtube" name="YouTube" fill="#EF4444" radius={[3,3,0,0]} />
                    <Bar dataKey="instagram" name="Instagram" fill="#EC4899" radius={[3,3,0,0]} />
                    <Bar dataKey="x" name="X" fill="#94a3b8" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <RevenueChart />
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-gray-400">
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              Syncing live analytics...
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
