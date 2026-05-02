"use client";

import React, { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OverviewCards from '@/components/dashboard/OverviewCards';
import AIContentStrategist from '@/components/dashboard/AIContentStrategist';
import PlatformSplit from '@/components/dashboard/PlatformSplit';
import RevenueChart from '@/components/dashboard/RevenueChart';
import DealTracker from '@/components/dashboard/DealTracker';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

export default function DashboardPage() {
  useEffect(() => { document.documentElement.classList.add('dark'); }, []);

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
