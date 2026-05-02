import React from 'react';
import { Target, Mail, Clock, Check, X, Gamepad2, CheckCircle } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';

export default function DealTracker() {
  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-[350px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white">Deal Tracker</h2>
          <span className="bg-dark-700 text-gray-300 text-[10px] uppercase px-2 py-0.5 rounded border border-dark-700">AI Synced</span>
        </div>
        <a href="#" className="text-sm text-purple-400 hover:text-purple-300">View All</a>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        
        {/* Collab Item (Pending Payment) */}
        <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center border border-blue-800">
              <Target size={18} className="text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">TechNova Promo</h4>
              <p className="text-xs text-gray-400 flex items-center"><Mail size={12} className="mr-1 text-gray-500" /> Invoice sent 2 days ago</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-white font-bold">$4,500</span>
            <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded mt-1 border border-yellow-500/20">Payment Pending</span>
          </div>
        </div>

        {/* Collab Item (Action Required) */}
        <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-800">
              <FaInstagram size={18} className="text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">EcoStyle Campaign</h4>
              <p className="text-xs text-gray-400 flex items-center"><FaInstagram size={12} className="mr-1 text-gray-500" /> Draft due tomorrow</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-white font-bold">$2,000</span>
            <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded mt-1 border border-red-400/20 flex items-center"><Clock size={12} className="mr-1" /> Action Needed</span>
          </div>
        </div>

        {/* Collab Item (New Request) */}
        <div className="bg-dark-900/50 border border-purple-500/30 rounded-xl p-4 flex justify-between items-center shadow-[0_0_15px_rgba(139,92,246,0.05)] relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1 h-full bg-purple-500"></div>
          <div className="flex items-center gap-4 pl-2">
            <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-800 text-white font-bold text-sm">
              SN
            </div>
            <div>
              <h4 className="text-white font-medium">SneakerHead Co.</h4>
              <p className="text-xs text-gray-400 flex items-center"><Mail size={12} className="mr-1 text-gray-500" /> New inquiry via email</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 transition-colors flex items-center justify-center"><Check size={14} /></button>
            <button className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors flex items-center justify-center"><X size={14} /></button>
          </div>
        </div>
        
        {/* Collab Item (Paid) */}
        <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 flex justify-between items-center opacity-60">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
              <Gamepad2 size={18} className="text-gray-400" />
            </div>
            <div>
              <h4 className="text-gray-300 font-medium">GameStream Sponsor</h4>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-gray-400 font-bold">$8,000</span>
            <span className="text-xs text-emerald-500 mt-1 flex items-center"><CheckCircle size={12} className="mr-1" />Paid</span>
          </div>
        </div>

      </div>
    </div>
  );
}
