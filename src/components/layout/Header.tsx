"use client";

import React from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';
import { FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="h-16 glass-panel border-b border-dark-700 flex items-center justify-between px-6 z-10 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-400 hover:text-white">
          <Menu size={22} />
        </button>
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-white/5 border border-dark-700 text-sm rounded-full pl-9 pr-4 py-2 focus:outline-none focus:border-purple-500 text-white w-56 transition-colors placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Synced pill */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-dark-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Synced</span>
          <FaYoutube size={14} className="text-red-500" />
          <FaInstagram size={14} className="text-pink-500" />
          <FaTwitter size={14} className="text-white" />
        </div>

        {/* Bell */}
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-pink-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 cursor-pointer pl-4 border-l border-dark-700">
          <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-8 h-8 rounded-full border-2 border-purple-500 object-cover" />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-white leading-tight">Alex Morgan</p>
            <p className="text-[11px] text-gray-500">Pro Creator</p>
          </div>
          <ChevronDown size={12} className="text-gray-600 ml-1" />
        </div>
      </div>
    </header>
  );
}
