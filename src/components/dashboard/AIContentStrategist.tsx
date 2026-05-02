"use client";

import React, { useEffect, useState } from 'react';
import { Brain, Lightbulb, Target, PlaySquare, Flame, PenTool, CalendarPlus, RotateCw } from 'lucide-react';

export default function AIContentStrategist() {
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchIdea = async () => {
    setLoading(true);
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
              contentIdeas {
                _id
                title
                reason
                predictedReach
                format
                trendMatch
              }
            }
          `
        })
      });
      const json = await res.json();
      if (json.data?.contentIdeas?.length > 0) {
        // Just show the first one for now
        setIdea(json.data.contentIdeas[0]);
      }
    } catch (err) {
      console.error('Failed to fetch AI ideas', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdea();
  }, []);

  if (loading) return (
    <div className="lg:col-span-2 ai-gradient-border p-[1px] rounded-2xl animate-pulse">
      <div className="bg-dark-800 rounded-2xl h-64"></div>
    </div>
  );

  if (!idea) return null;

  return (
    <div className="lg:col-span-2 ai-gradient-border p-[1px] shadow-2xl shadow-purple-900/20 rounded-2xl">
      <div className="bg-dark-800 rounded-2xl h-full p-6 relative overflow-hidden">
        {/* Background pattern for AI box */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">AI Content Strategist</h2>
              <p className="text-xs text-gray-400">Analyzing recent engagement & trends</p>
            </div>
          </div>
          <span className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30 animate-pulse">Live Analysis</span>
        </div>

        <div className="bg-dark-900/80 border border-dark-700 rounded-xl p-5 mb-5 relative z-10">
          <div className="flex items-start gap-4">
            <Lightbulb size={24} className="text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-white font-semibold mb-2 text-lg">Suggested Next Post: &quot;{idea.title}&quot;</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {idea.reason}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-dark-700 text-gray-300 rounded border border-gray-600 flex items-center"><Target size={12} className="text-blue-400 mr-1" /> Predicted Reach: {idea.predictedReach}</span>
                <span className="text-xs px-2 py-1 bg-dark-700 text-gray-300 rounded border border-gray-600 flex items-center"><PlaySquare size={12} className="text-red-500 mr-1" /> Format: {idea.format}</span>
                <span className="text-xs px-2 py-1 bg-dark-700 text-gray-300 rounded border border-gray-600 flex items-center"><Flame size={12} className="text-orange-500 mr-1" /> Trend Match: {idea.trendMatch}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 relative z-10">
          <button className="flex-1 bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 flex items-center justify-center">
            <PenTool size={16} className="mr-2" /> Generate Script Outline
          </button>
          <button onClick={fetchIdea} className="px-6 py-2.5 bg-dark-700 border border-dark-700 text-white font-medium rounded-lg hover:bg-dark-700/80 transition-colors flex items-center justify-center">
            <RotateCw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
