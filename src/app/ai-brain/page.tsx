"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import { aiSuggestions, audienceInsights } from '@/lib/dummy-data';
import { Brain, Lightbulb, Target, Flame, BarChart2, Users, TrendingUp, Clock, RotateCw, PenTool, CalendarPlus, ChevronRight } from 'lucide-react';

function AISuggestionCard({ s, active, onClick }: { s: typeof aiSuggestions[0]; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 ${
        active
          ? 'bg-purple-600/10 border-purple-500/40 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
          : 'bg-white/3 border-dark-700 hover:border-dark-600 hover:bg-white/5'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
              s.contentType === 'Milestone' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
              : s.contentType === 'Tutorial' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10'
              : 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
            }`}>{s.contentType}</span>
          </div>
          <p className="text-sm font-semibold text-white line-clamp-2">{s.title}</p>
        </div>
        <div className={`text-lg font-bold flex-shrink-0 ${s.trendMatch >= 95 ? 'text-yellow-400' : s.trendMatch >= 85 ? 'text-emerald-400' : 'text-blue-400'}`}>
          {s.trendMatch}%
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        {s.platforms.map(p => (
          <span key={p} className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-md border border-dark-700">{p}</span>
        ))}
      </div>
    </div>
  );
}

export default function AIBrainPage() {
  useEffect(() => { document.documentElement.classList.add('dark'); }, []);
  const [activeIdx, setActiveIdx] = useState(0);
  const active = aiSuggestions[activeIdx];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6 pb-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Brain size={18} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">AI Brain</h1>
              <span className="text-xs text-purple-300 bg-purple-500/20 border border-purple-500/30 px-2.5 py-0.5 rounded-full animate-pulse">Live Analysis</span>
            </div>
            <p className="text-gray-400 text-sm">Powered by your real audience data — updated every 6 hours.</p>
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-white/5 border border-dark-700 px-4 py-2 rounded-xl transition-colors">
            <RotateCw size={14} /> Refresh
          </button>
        </div>

        {/* Main AI Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Suggestions List */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Content Ideas ({aiSuggestions.length})</h2>
            {aiSuggestions.map((s, i) => (
              <AISuggestionCard key={s.id} s={s} active={i === activeIdx} onClick={() => setActiveIdx(i)} />
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-3 space-y-4">
            {/* Gradient border card */}
            <div className="ai-gradient-border p-[1px] rounded-2xl shadow-2xl shadow-purple-900/20">
              <div className="bg-dark-800 rounded-2xl p-6 relative overflow-hidden h-full">
                <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                <div className="flex items-start gap-3 mb-5 relative z-10">
                  <Lightbulb size={22} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Suggested Next Post</p>
                    <h2 className="text-xl font-bold text-white">{active.title}</h2>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-5 relative z-10">{active.reason}</p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                  {[
                    { icon: Target, label: 'Predicted Reach', value: active.predictedReach, color: 'text-blue-400' },
                    { icon: Flame, label: 'Trend Match', value: `${active.trendMatch}%`, color: 'text-orange-400' },
                    { icon: Clock, label: 'Best Post Time', value: active.bestTime, color: 'text-purple-400' },
                    { icon: Users, label: 'Primary Audience', value: active.audienceType, color: 'text-emerald-400' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="bg-dark-900/60 border border-dark-700 rounded-xl p-3 flex items-center gap-3">
                      <Icon size={16} className={color} />
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">{label}</p>
                        <p className="text-sm font-semibold text-white">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-2 mb-5 relative z-10">
                  {active.tags.map(tag => (
                    <span key={tag} className="text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">{tag}</span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 relative z-10">
                  <button className="flex-1 bg-white text-black font-bold py-2.5 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm">
                    <PenTool size={15} /> Generate Script
                  </button>
                  <button className="px-4 py-2.5 bg-white/5 border border-dark-700 text-white rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 text-sm">
                    <CalendarPlus size={15} /> Schedule
                  </button>
                </div>
              </div>
            </div>

            {/* Engagement Score */}
            <div className="glass-panel p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-white">AI Engagement Score</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{active.engagementScore}/100</p>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
                  style={{ width: `${active.engagementScore}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Based on trend match, audience alignment & historical performance</p>
            </div>
          </div>
        </div>

        {/* Audience Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Age */}
          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-purple-400" />
              <h3 className="text-sm font-semibold text-white">Age Distribution</h3>
            </div>
            <div className="space-y-2.5">
              {audienceInsights.ageGroups.map(({ group, pct }) => (
                <div key={group}>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{group}</span><span className="text-white font-semibold">{pct}%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-400" style={{ width: `${pct * 2}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={16} className="text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Gender Split</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Male', pct: audienceInsights.genderSplit.male, color: 'from-blue-500 to-blue-400' },
                { label: 'Female', pct: audienceInsights.genderSplit.female, color: 'from-pink-500 to-pink-400' },
                { label: 'Other', pct: audienceInsights.genderSplit.other, color: 'from-gray-500 to-gray-400' },
              ].map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{label}</span><span className="text-white font-semibold">{pct}%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Top Countries</h3>
            </div>
            <div className="space-y-2.5">
              {audienceInsights.topCountries.map(({ country, pct }) => (
                <div key={country} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{country}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-dark-700 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(pct / 34) * 100}%` }} />
                    </div>
                    <span className="text-xs text-white font-semibold w-8 text-right">{pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
