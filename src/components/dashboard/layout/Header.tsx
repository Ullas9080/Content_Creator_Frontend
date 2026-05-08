"use client";
import { API_BASE_URL } from '@/config/api';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Menu, Search, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Header() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuthStore();

  // Auth state is now managed globally by AuthHydrator and useAuthStore

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

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
          <FaYoutube size={14} className={user?.youtubeChannelName ? "text-red-500" : "text-gray-600"} />
          <FaInstagram size={14} className={user?.instagramHandle ? "text-pink-500" : "text-gray-600"} />
          <FaTwitter size={14} className={user?.xHandle ? "text-blue-400" : "text-gray-600"} />
        </div>

        {/* Bell */}
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-pink-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="relative">
          <div 
            className="flex items-center gap-2.5 cursor-pointer pl-4 border-l border-dark-700 group"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img src={user?.photo || "https://i.pravatar.cc/150?img=32"} alt="Profile" className="w-8 h-8 rounded-full border-2 border-purple-500 object-cover transition-transform group-hover:scale-105" />
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-white leading-tight">{user?.displayName || 'Loading...'}</p>
              <p className="text-[11px] text-gray-500">Pro Creator</p>
            </div>
            <ChevronDown size={12} className={`text-gray-600 ml-1 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-3 w-56 glass-panel border border-dark-700 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="px-4 py-3 border-b border-dark-700/50 mb-1">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Account</p>
                  <p className="text-sm font-bold text-white">{user?.displayName || 'Loading...'}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user?.email || 'Loading...'}</p>
                </div>
                
                <button 
                  onClick={() => { router.push('/settings'); setShowDropdown(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <User size={16} className="text-gray-500" />
                  Profile Settings
                </button>
                
                <button 
                  onClick={() => { router.push('/settings'); setShowDropdown(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Settings size={16} className="text-gray-500" />
                  Preferences
                </button>

                <div className="h-px bg-dark-700/50 my-1 mx-2" />

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


