"use client";

import React, { useEffect, useState } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { revenueData } from '@/lib/dummy-data';
import { useDashboardStore } from '@/store/useDashboardStore';

// Custom tooltip to fix recharts TypeScript error
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-[#1e2230] border border-[#334155] rounded-lg p-2 text-white">
        <p className="text-sm font-semibold mb-1">{label}</p>
        <p className="text-sm">
          Revenue: <span className="font-bold text-purple-400">${value?.toLocaleString()}</span>
        </p>
      </div>
    );
  }

  return null;
};

export default function RevenueChart() {
  const revenueEntries = useDashboardStore((state) => state.revenueEntries);
  const [data, setData] = useState(
    revenueData.map((e) => ({ name: e.month, total: e.total }))
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (revenueEntries.length > 0) {
      setData(
        revenueEntries.map((entry) => ({
          name: entry.month,
          total: Number(entry.total),
        })),
      );
    }
    setMounted(true);
  }, [revenueEntries]);

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Revenue Tracker</h2>
          <p className="text-sm text-gray-400">Combined AdSense & Brand Deals</p>
        </div>
        <select className="bg-dark-900 border border-dark-700 text-sm text-gray-300 rounded-lg px-3 py-1 focus:outline-none">
          <option>This Year</option>
          <option>Last 6 Months</option>
        </select>
      </div>
      <div className="h-64 w-full flex-1 min-h-0">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2230" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              stroke="#94a3b8" 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => `$${value/1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#151822', stroke: '#8B5CF6', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              fillOpacity={1} 
              fill="url(#colorTotal)" 
            />
          </RechartsLineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}


