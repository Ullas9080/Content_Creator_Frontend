"use client";

import React, { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RevenueChart from '@/components/dashboard/RevenueChart';
import { platforms, topVideos, performanceData } from '@/lib/dummy-data';
import { BarChart3, TrendingUp, Eye, ThumbsUp, MessageCircle } from 'lucide-react';
import { FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

const PlatformIcon = ({ id }: { id: string }) => {
  if (id === 'youtube') return <FaYoutube className="text-red-500" size={16} />;
  if (id === 'instagram') return <FaInstagram className="text-pink-500" size={16} />;
  return <FaTwitter className="text-white" size={16} />;
};

export default function AnalyticsPage() {
  useEffect(() => { document.documentElement.classList.add('dark'); }, []);

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
          <p className="text-gray-400 text-sm">Cross-platform performance breakdown for the last 30 days.</p>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms.map(p => (
            <div key={p.id} className={`glass-panel p-5 rounded-2xl border border-dark-700 ${p.border} transition-all duration-200 cursor-pointer group`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center`}>
                  <PlatformIcon id={p.id} />
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">{p.weekGrowth}</span>
              </div>
              <p className="text-2xl font-bold text-white">{p.followers}</p>
              <p className="text-xs text-gray-500 mt-0.5">{p.followerLabel} on {p.name}</p>
              <div className="mt-4 pt-4 border-t border-dark-700 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{p.metricLabel}</p>
                  <p className="text-sm font-semibold text-white">{p.metricValue}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Views</p>
                  <p className="text-sm font-semibold text-white">{p.views}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Cross-platform performance */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-base font-bold text-white mb-1">Cross-Platform Performance</h2>
            <p className="text-xs text-gray-500 mb-5">Weekly views by platform</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} barSize={10} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2230" vertical={false} />
                  <XAxis dataKey="week" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={v => `${v/1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e2230', borderColor: '#334155', borderRadius: '8px' }}
                    formatter={(v: any) => [`${(v/1000).toFixed(0)}k views`]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                  <Bar dataKey="youtube" name="YouTube" fill="#EF4444" radius={[3,3,0,0]} />
                  <Bar dataKey="instagram" name="Instagram" fill="#EC4899" radius={[3,3,0,0]} />
                  <Bar dataKey="x" name="X" fill="#94a3b8" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <RevenueChart />
        </div>

        {/* Top Performing Content */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white">Top Performing Content</h2>
            <span className="text-xs text-purple-400">Last 30 days</span>
          </div>
          <div className="space-y-4">
            {topVideos.map((v, i) => (
              <div key={v.id} className="flex items-center gap-4 p-4 bg-white/3 rounded-xl border border-dark-700 hover:border-dark-600 hover:bg-white/5 transition-all group">
                <span className="text-lg font-bold text-gray-700 w-6 text-center flex-shrink-0">{i + 1}</span>
                <img src={v.thumbnail} alt={v.title} className="w-20 h-11 rounded-lg object-cover flex-shrink-0 bg-dark-700" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">{v.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <PlatformIcon id={v.platform.toLowerCase()} />
                    <span className="text-[11px] text-gray-500">{v.platform} · {v.publishedAt}</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-5 text-xs text-gray-400 flex-shrink-0">
                  <span className="flex items-center gap-1"><Eye size={12} /> {v.views}</span>
                  <span className="flex items-center gap-1"><ThumbsUp size={12} /> {v.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={12} /> {v.comments}</span>
                  <span className="text-emerald-400 font-semibold">{v.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
