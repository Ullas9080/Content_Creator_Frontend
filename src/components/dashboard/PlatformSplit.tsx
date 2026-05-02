import React from 'react';
import { FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function PlatformSplit() {
  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
      <h2 className="text-lg font-bold text-white mb-2">Platform Split</h2>
      
      {/* YT */}
      <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 flex items-center justify-between hover:border-red-500/50 transition-colors cursor-pointer group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <FaYoutube size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-white font-semibold">1.2M <span className="text-xs font-normal text-gray-400">Subs</span></p>
            <p className="text-xs text-emerald-400">+5k this week</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Revenue</p>
          <p className="text-white font-medium">$4.2k</p>
        </div>
      </div>

      {/* IG */}
      <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 flex items-center justify-between hover:border-pink-500/50 transition-colors cursor-pointer group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
            <FaInstagram size={20} className="text-pink-500 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-white font-semibold">850k <span className="text-xs font-normal text-gray-400">Followers</span></p>
            <p className="text-xs text-emerald-400">+2.1k this week</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Reach</p>
          <p className="text-white font-medium">2.4M</p>
        </div>
      </div>

      {/* X */}
      <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 flex items-center justify-between hover:border-gray-500/50 transition-colors cursor-pointer group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-500/10 flex items-center justify-center">
            <FaTwitter size={20} className="text-white group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-white font-semibold">1.35M <span className="text-xs font-normal text-gray-400">Followers</span></p>
            <p className="text-xs text-emerald-400">+12k this week</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Impressions</p>
          <p className="text-white font-medium">15M</p>
        </div>
      </div>
    </div>
  );
}
