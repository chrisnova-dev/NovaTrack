import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCards({ totalAssets, change, loading, isConnected }) {
  // Loading skeleton state
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 h-full">
        {[1, 2].map((i) => (
          <div key={i} className="bg-[#0f172a] p-6 rounded-[1.5rem] border border-white/10 animate-pulse">
            <div className="h-2 w-12 bg-white/5 rounded mb-3 mx-auto" />
            <div className="h-6 w-16 bg-white/5 rounded mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  // Not connected state
  if (!isConnected) {
    return (
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="bg-[#0f172a] p-6 rounded-[1.5rem] border border-white/5 opacity-50 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Assets</p>
          <p className="text-gray-600 text-xl font-bold mt-1">—</p>
        </div>
        <div className="bg-[#0f172a] p-6 rounded-[1.5rem] border border-white/5 opacity-50 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Change</p>
          <p className="text-gray-600 text-xl font-bold mt-1">—</p>
        </div>
      </div>
    );
  }

  const isPositive = (change || 0) >= 0;

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Total Assets Count */}
      <div className="bg-[#0f172a] p-6 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center shadow-xl hover:border-white/20 transition-colors">
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Assets</p>
        <p className="text-white text-3xl font-black mt-2 tracking-tighter italic">
          {totalAssets || 0}
        </p>
      </div>

      {/* 24h Portfolio Change */}
      <div className="bg-[#0f172a] p-6 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center shadow-xl hover:border-white/20 transition-colors">
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">24h Performance</p>
        <div className={`flex items-center gap-1 mt-2 ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? <TrendingUp size={20} strokeWidth={3} /> : <TrendingDown size={20} strokeWidth={3} />}
          <p className="text-2xl font-black tracking-tighter italic">
            {Math.abs(change || 0).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}