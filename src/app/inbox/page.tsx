"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import { inboxMessages } from '@/lib/dummy-data';
import { MessageSquare, Mail, Tag, Check, Trash2, Archive, Filter, Search } from 'lucide-react';
import { FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa';

const platformIcon = (p: string) => {
  if (p === 'youtube') return <FaYoutube size={12} className="text-red-500" />;
  if (p === 'instagram') return <FaInstagram size={12} className="text-pink-500" />;
  if (p === 'x') return <FaTwitter size={12} className="text-white" />;
  return <Mail size={12} className="text-blue-400" />;
};

const tagBadge = (tag: string | null) => {
  if (tag === 'top_fan') return <span className="text-[10px] text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full">⭐ Top Fan</span>;
  if (tag === 'brand') return <span className="text-[10px] text-purple-400 bg-purple-400/10 border border-purple-400/20 px-2 py-0.5 rounded-full">🤝 Brand</span>;
  return null;
};

export default function InboxPage() {
  useEffect(() => { document.documentElement.classList.add('dark'); }, []);
  const [filter, setFilter] = useState<'all' | 'unread' | 'brand' | 'top_fan'>('all');
  const [selected, setSelected] = useState(inboxMessages[0]);

  const filtered = inboxMessages.filter(m => {
    if (filter === 'unread') return !m.read;
    if (filter === 'brand') return m.tag === 'brand';
    if (filter === 'top_fan') return m.tag === 'top_fan';
    return true;
  });

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-5 pb-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <MessageSquare size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Unified Inbox</h1>
            <span className="text-xs text-white bg-pink-500 px-2 py-0.5 rounded-full font-bold">
              {inboxMessages.filter(m => !m.read).length} new
            </span>
          </div>
          <p className="text-gray-400 text-sm">All your YouTube comments, Instagram DMs, and brand emails in one place.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Messages', value: inboxMessages.length, color: 'text-white' },
            { label: 'Unread', value: inboxMessages.filter(m => !m.read).length, color: 'text-pink-400' },
            { label: 'Brand DMs', value: inboxMessages.filter(m => m.tag === 'brand').length, color: 'text-purple-400' },
            { label: 'Top Fan Messages', value: inboxMessages.filter(m => m.tag === 'top_fan').length, color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="glass-panel p-4 rounded-xl">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Inbox UI */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Message List */}
          <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: '600px' }}>
            {/* Filter tabs */}
            <div className="flex gap-1 p-3 border-b border-dark-700 flex-shrink-0">
              {(['all', 'unread', 'brand', 'top_fan'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[11px] px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors ${
                    filter === f ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {f === 'top_fan' ? 'Top Fans' : f}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              {filtered.map(m => (
                <div
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className={`flex items-start gap-3 p-4 border-b border-dark-700 cursor-pointer transition-colors ${
                    selected.id === m.id ? 'bg-purple-600/10' : 'hover:bg-white/3'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img src={m.avatar} alt={m.from} className="w-9 h-9 rounded-full object-cover" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-dark-800 flex items-center justify-center">
                      {platformIcon(m.platform)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className={`text-sm font-semibold truncate ${m.read ? 'text-gray-300' : 'text-white'}`}>{m.from}</p>
                      <span className="text-[10px] text-gray-600 flex-shrink-0">{m.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{m.message}</p>
                    {m.tag && <div className="mt-1">{tagBadge(m.tag)}</div>}
                  </div>
                  {!m.read && <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />}
                </div>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-3 glass-panel rounded-2xl p-6 flex flex-col" style={{ maxHeight: '600px' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={selected.avatar} alt={selected.from} className="w-12 h-12 rounded-full border-2 border-dark-700" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-dark-800 flex items-center justify-center">
                    {platformIcon(selected.platform)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">{selected.from}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 capitalize">{selected.type.replace('_', ' ')}</span>
                    {tagBadge(selected.tag)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-gray-400 hover:text-white"><Archive size={14} /></button>
                <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors flex items-center justify-center text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <p className="text-gray-300 text-sm leading-relaxed">{selected.message}</p>
                <p className="text-[11px] text-gray-600 mt-3">{selected.time}</p>
              </div>
            </div>

            {/* Reply box */}
            <div className="mt-4 flex gap-3">
              <textarea
                placeholder="Type your reply..."
                rows={2}
                className="flex-1 bg-white/5 border border-dark-700 text-sm text-white rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors resize-none placeholder:text-gray-600"
              />
              <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors flex-shrink-0 flex items-center gap-2 text-sm self-end">
                <Check size={14} /> Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
