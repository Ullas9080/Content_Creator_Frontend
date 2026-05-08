"use client";

import React, { useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import { deals, paymentSummary, revenueData } from '@/lib/dummy-data';
import RevenueChart from '@/components/dashboard/RevenueChart';
import { Wallet, CircleDollarSign, Clock, Check, X, TrendingUp, Mail, FileText, ChevronRight } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending_payment: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  action_needed: 'text-red-400 bg-red-400/10 border-red-400/20',
  new_request: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  in_review: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
};

const dealsPipeline = [
  { label: 'New Requests', count: deals.filter(d => d.status === 'new_request').length, color: 'bg-purple-500' },
  { label: 'In Review', count: deals.filter(d => d.status === 'in_review').length, color: 'bg-orange-500' },
  { label: 'Action Needed', count: deals.filter(d => d.status === 'action_needed').length, color: 'bg-red-500' },
  { label: 'Pending Payment', count: deals.filter(d => d.status === 'pending_payment').length, color: 'bg-yellow-500' },
  { label: 'Completed', count: deals.filter(d => d.status === 'completed').length, color: 'bg-emerald-500' },
];

export default function BusinessPage() {
  useEffect(() => { document.documentElement.classList.add('dark'); }, []);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Wallet size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Business Manager</h1>
          </div>
          <p className="text-gray-400 text-sm">Track brand deals, payments, contracts, and revenue forecasting.</p>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Earned', value: paymentSummary.totalEarned, icon: TrendingUp, color: 'text-emerald-400 bg-emerald-400/10' },
            { label: 'Pending Payments', value: paymentSummary.pendingPayments, icon: Clock, color: 'text-yellow-400 bg-yellow-400/10' },
            { label: 'Avg Deal Value', value: paymentSummary.avgDealValue, icon: CircleDollarSign, color: 'text-purple-400 bg-purple-400/10' },
            { label: 'Deals This Month', value: paymentSummary.dealsThisMonth, icon: FileText, color: 'text-blue-400 bg-blue-400/10' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-panel p-5 rounded-2xl">
              <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon size={16} className={color.split(' ')[0]} />
              </div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Pipeline */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-base font-bold text-white mb-4">Deal Pipeline</h2>
          <div className="flex gap-1 h-2.5 rounded-full overflow-hidden mb-4">
            {dealsPipeline.map(s => (
              <div key={s.label} className={`${s.color} flex-1`} />
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-3">
            {dealsPipeline.map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                <span className="text-xs text-gray-400">{s.label} <span className="text-white font-bold">({s.count})</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Deals Table */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-dark-700">
            <h2 className="text-base font-bold text-white">Brand Deals</h2>
            <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              + Add Deal <ChevronRight size={12} />
            </button>
          </div>

          <div className="divide-y divide-dark-700">
            {deals.map(deal => (
              <div key={deal.id} className="flex items-center gap-4 p-5 hover:bg-white/3 transition-colors group">
                {/* Brand Avatar */}
                <div className={`w-11 h-11 rounded-xl ${deal.logoColor} flex items-center justify-center font-bold text-sm flex-shrink-0 border`}>
                  <span className={deal.logoIcon}>{deal.logo}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{deal.brand}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[deal.status]}`}>
                      {deal.statusLabel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{deal.deliverable} · Due: {deal.dueDate}</p>
                </div>

                {/* Platform */}
                <div className="hidden md:block text-xs text-gray-500 flex-shrink-0 w-28 text-center">
                  {deal.platform}
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0 w-20">
                  <p className="text-sm font-bold text-white">${deal.amount.toLocaleString()}</p>
                </div>

                {/* Actions (only for new_request) */}
                {deal.status === 'new_request' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 transition-colors flex items-center justify-center"><Check size={14} /></button>
                    <button className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors flex items-center justify-center"><X size={14} /></button>
                  </div>
                )}

                {/* Contact link for others */}
                {deal.status !== 'new_request' && (
                  <button className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Mail size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Forecast */}
        <RevenueChart />
      </div>
    </DashboardLayout>
  );
}
