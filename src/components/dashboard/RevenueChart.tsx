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
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify({
            query: `
              query {
                revenueEntries {
                  month
                  total
                }
              }
            `
          })
        });
        const json = await res.json();
        if (json.data?.revenueEntries) {
          setData(json.data.revenueEntries.map((e: any) => ({
            name: e.month,
            total: e.total
          })));
        }
      } catch (err) {
        console.error('Failed to fetch revenue data', err);
      }
    };
    fetchRevenue();
  }, []);

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
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data.length > 0 ? data : []}>
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
      </div>
    </div>
  );
}
