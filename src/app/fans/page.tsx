"use client";

import React, { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { topFans, fanSegments, audienceInsights } from '@/lib/dummy-data';
import { Users, Star, TrendingUp, MessageSquare, Heart } from 'lucide-react';
import { FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa';

const PlatformBadge = ({ p }: { p: string }) => {
  if (p === 'youtube') return <span className="flex items-center gap-1 text-[10px] text-red-400"><FaYoutube size={10} /> YouTube</span>;
  if (p === 'instagram') return <span className="flex items-center gap-1 text-[10px] text-pink-400"><FaInstagram size={10} /> Instagram</span>;
  return <span className="flex items-center gap-1 text-[10px] text-white"><FaTwitter size={10} /> X</span>;
};

export default function FanCRMPage() {
  useEffect(() => { document.documentElement.classList.add('dark'); }, []);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Users size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Fan CRM</h1>
          </div>
          <p className="text-gray-400 text-sm">Track and nurture your most loyal fans across all platforms.</p>
        </div>

        {/* Segment Overview */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-sm font-semibold text-white mb-4">Audience Segments</h2>
          <div className="flex h-3 rounded-full overflow-hidden mb-4 gap-0.5">
            {fanSegments.map(s => (
              <div key={s.name} className={`${s.color} transition-all`} style={{ width: `${s.pct}%` }} />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {fanSegments.map(s => (
              <div key={s.name} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${s.color}`} />
                <div>
                  <p className="text-sm font-semibold text-white">{s.count.toLocaleString()}</p>
                  <p className="text-[11px] text-gray-500">{s.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Fans */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2"><Star size={16} className="text-yellow-400" /> Top Fans</h2>
            <span className="text-xs text-gray-500">Ranked by engagement score</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {topFans.map((fan, i) => (
              <div key={fan.id} className="glass-panel p-5 rounded-2xl border border-dark-700 hover:border-purple-500/30 transition-all duration-200 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={fan.avatar} alt={fan.name} className="w-12 h-12 rounded-full object-cover border-2 border-dark-700 group-hover:border-purple-500 transition-colors" />
                      <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center text-[10px] font-bold text-gray-400">
                        #{i + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{fan.name}</p>
                      <p className="text-[11px] text-gray-500">{fan.handle}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${fan.tierColor}`}>
                    {fan.tier}
                  </span>
                </div>

                {/* Engagement Score Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-500">Engagement Score</span>
                    <span className="font-bold text-white">{fan.engagementScore}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${fan.engagementScore}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { icon: Heart, label: 'Likes', value: fan.totalLikes },
                    { icon: MessageSquare, label: 'Comments', value: fan.comments },
                    { icon: TrendingUp, label: 'Shares', value: fan.shares },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="text-center bg-white/3 rounded-lg p-2">
                      <Icon size={12} className="text-gray-500 mx-auto mb-0.5" />
                      <p className="text-sm font-bold text-white">{value}</p>
                      <p className="text-[10px] text-gray-600">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-3 border-t border-dark-700">
                  <PlatformBadge p={fan.platform} />
                  <span>{fan.country}</span>
                  <span>Since {fan.memberSince}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Engagement Hours */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-base font-bold text-white mb-2">Peak Engagement Hours</h2>
          <p className="text-xs text-gray-500 mb-5">When your fans are most active (local time)</p>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 24 }, (_, h) => {
              const label = `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'AM' : 'PM'}`;
              const isPeak = audienceInsights.peakHours.includes(label);
              const height = isPeak ? 'h-12' : h >= 18 && h <= 22 ? 'h-8' : h >= 12 && h <= 17 ? 'h-5' : 'h-2';
              return (
                <div key={h} className="flex flex-col items-center gap-1.5">
                  <div className={`w-4 ${height} rounded-sm transition-all ${isPeak ? 'bg-purple-500' : 'bg-dark-700'}`} />
                  {h % 3 === 0 && <span className="text-[9px] text-gray-600">{label}</span>}
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-400 mt-4">Best posting times: <span className="text-white font-semibold">{audienceInsights.peakHours.join(', ')}</span></p>
        </div>
      </div>
    </DashboardLayout>
  );
}
