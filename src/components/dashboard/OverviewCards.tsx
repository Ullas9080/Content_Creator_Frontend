import React, { useEffect, useState } from 'react';
import { Users, CircleDollarSign, Handshake, Heart, TrendingUp } from 'lucide-react';

export default function OverviewCards() {
  const [stats, setStats] = useState({
    totalAudience: '...',
    pendingRevenue: '...',
    activeCollabs: '...',
    avgEngagement: '...',
  });

  useEffect(() => {
    const fetchStats = async () => {
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
                dashboardStats {
                  totalAudience
                  pendingRevenue
                  activeCollabs
                  avgEngagement
                }
              }
            `
          })
        });
        const { data } = await res.json();
        if (data?.dashboardStats) {
          setStats(data.dashboardStats);
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat 1 */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-gray-600 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Audience</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.totalAudience}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Users size={20} />
          </div>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-emerald-400 flex items-center"><TrendingUp size={14} className="mr-1" /> +12.5%</span>
          <span className="text-gray-500 ml-2">vs last month</span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Stat 2 */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-gray-600 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-400 text-sm font-medium">Pending Revenue</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.pendingRevenue}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CircleDollarSign size={20} />
          </div>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-gray-400">From 4 upcoming deals</span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Stat 3 */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-gray-600 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-400 text-sm font-medium">Active Collabs</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.activeCollabs}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
            <Handshake size={20} />
          </div>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-orange-400">3 deliverables due soon</span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Stat 4 */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-gray-600 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-400 text-sm font-medium">Avg. Engagement</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.avgEngagement}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400">
            <Heart size={20} />
          </div>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-emerald-400 flex items-center"><TrendingUp size={14} className="mr-1" /> +1.2%</span>
          <span className="text-gray-500 ml-2">across all platforms</span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </div>
  );
}
