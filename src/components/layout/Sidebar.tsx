"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Sparkles, BarChart3, 
  Wallet, MessageSquare, Users, Settings, Handshake
} from 'lucide-react';

const navItems = [
  { href: '/',          label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/ai-brain',  label: 'AI Brain',       icon: Sparkles,   badge: 'Live' },
  { href: '/analytics', label: 'Analytics',      icon: BarChart3 },
  { href: '/inbox',     label: 'Unified Inbox',  icon: MessageSquare, badge: '4' },
  { href: '/fans',      label: 'Fan CRM',        icon: Users },
  { href: '/business',  label: 'Business',       icon: Wallet, badge: '2' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-panel border-r border-dark-700 hidden md:flex flex-col justify-between z-20 relative flex-shrink-0">
      <div>
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 tracking-tight">
              Fanovix
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1 mt-2">
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  active
                    ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-white border-l-2 border-purple-500 font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={active ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'} />
                <span className="text-sm">{label}</span>
                {badge && (
                  <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    badge === 'Live'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse'
                      : 'bg-purple-600 text-white'
                  }`}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="p-4 space-y-1 border-t border-dark-700">
        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          <Settings size={18} className="text-gray-500" />
          <span className="text-sm">Settings</span>
        </Link>
        {/* User pill */}
        <div className="flex items-center gap-3 mt-4 px-2">
          <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-9 h-9 rounded-full border-2 border-purple-500 object-cover flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">Alex Morgan</p>
            <p className="text-xs text-gray-500 truncate">Pro Creator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
