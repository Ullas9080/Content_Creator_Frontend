"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import OverviewCards from '@/components/dashboard/OverviewCards';
import AIContentStrategist from '@/components/dashboard/AIContentStrategist';
import PlatformSplit from '@/components/dashboard/PlatformSplit';
import RevenueChart from '@/components/dashboard/RevenueChart';
import DealTracker from '@/components/dashboard/DealTracker';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { fetchDashboardData } = useDashboardStore();

  useEffect(() => { 
    document.documentElement.classList.add('dark'); 
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, fetchDashboardData]);

  if (authLoading && !isAuthenticated) {
    return (
      <div className="h-screen bg-[#0f111a] flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f111a] text-slate-50 flex flex-col items-center overflow-x-hidden relative font-sans">
         {/* Navigation / Header Placeholder */}
         <nav className="w-full max-w-7xl px-6 py-6 flex items-center justify-between z-20">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
               <span className="text-white font-bold">✧</span>
             </div>
             <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 tracking-tight">
               Fanovix
             </span>
           </div>
           <button onClick={() => router.push('/login')} className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
             Log In
           </button>
         </nav>

         {/* Ambient glows */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
         
         {/* Hero Section */}
         <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-20 px-6 z-10 w-full">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-widest mb-8">
             <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
             CreatorOS 2.0 is Live
           </div>
           
           <h1 className="text-5xl md:text-7xl font-bold text-center tracking-tight leading-[1.1] mb-6 max-w-4xl">
             The ultimate operating system for <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">modern creators.</span>
           </h1>
           
           <p className="text-gray-400 text-lg md:text-xl text-center mb-10 max-w-2xl leading-relaxed">
             Stop jumping between tabs. Manage your YouTube, Instagram, and X analytics, brand deals, fan CRM, and AI content ideas — all in one premium, unified dashboard.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
             <button 
               onClick={() => router.push('/login')} 
               className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-full font-bold shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all hover:scale-105"
             >
               Sign Up Free
             </button>
             <button 
               onClick={() => router.push('/login')}
               className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-semibold transition-all hover:scale-105"
             >
               Log In
             </button>
           </div>

           {/* Dashboard Image Preview Container */}
           <div className="relative w-full max-w-6xl mt-4">
              <div className="absolute -inset-1 bg-gradient-to-b from-purple-500/30 to-transparent rounded-[2rem] blur-xl opacity-50" />
              <div className="relative w-full rounded-[2rem] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden bg-dark-900 group transform transition-transform duration-700 hover:scale-[1.01]">
                 {/* Fake Window Header */}
                 <div className="h-10 bg-[#1a1c29] border-b border-white/5 flex items-center px-4 gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/80" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                   <div className="w-3 h-3 rounded-full bg-green-500/80" />
                 </div>
                 <img 
                   src="/dashboard-preview.png" 
                   alt="Fanovix Dashboard" 
                   className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = 'https://placehold.co/1200x675/1a1c29/ffffff?text=Your+Dashboard+Image+Here';
                   }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent pointer-events-none opacity-80" />
              </div>
           </div>
         </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Good morning, Alex 👋</h1>
            <p className="text-gray-400 text-sm mt-0.5">Here's what's happening across your empire today.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-xl text-white border border-dark-700 transition-colors flex items-center gap-2">
              Last 30 Days <ChevronDown size={13} />
            </button>
            <button className="px-4 py-2 text-sm bg-white text-black hover:bg-gray-100 font-semibold rounded-xl transition-colors flex items-center gap-2">
              <ArrowUpRight size={14} /> Export
            </button>
          </div>
        </div>

        <OverviewCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <AIContentStrategist />
          <PlatformSplit />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-6">
          <RevenueChart />
          <DealTracker />
        </div>
      </div>
    </DashboardLayout>
  );
}
