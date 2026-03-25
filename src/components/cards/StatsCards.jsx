import React from 'react';
import { TrendingUp, TrendingDown, Layers, BarChart3 } from 'lucide-react';

export default function StatsCards({ totalAssets, change, loading, isConnected }) {
  
  // 1. Loading State (Matches the rounded shelf look)
  if (loading) {
    return (
      <div className="bg-[#0B0E14]/40 border border-white/5 rounded-[2.5rem] h-full w-full animate-pulse flex items-center justify-center p-8">
        <div className="h-8 w-1/2 bg-white/5 rounded-full" />
      </div>
    );
  }



  const isPositive = (change || 0) >= 0;

  return (
    <div className=" backdrop-blur-xl mt-13  p-4 flex items-center  shadow-2xl transition-all hover:border-cyan-500/30">
      

      {/* STAT 1: Asset Count */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Layers size={12} className="text-cyan-500" />
          <p className="text-slate-500 text-[10px] font-black  tracking-[0.2em]">Total Assets</p>
        </div>
        <p className="text-white text-2xl font-black tracking-tighter  font-mono">
          {totalAssets || 0}
        </p>
      </div>

      {/* THE DEMARCATION LINE */}
      <div className="h-14 w-[1px] bg-gradient-to-b from-transparent via-cyan-700 to-transparent " />

      {/* STAT 2: Performance */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 size={12} className="text-cyan-500" />
          <p className="text-slate-500 text-[10px] font-black tracking-[0.2em]">Flow</p>
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
          {isPositive ? <TrendingUp size={20} strokeWidth={3} /> : <TrendingDown size={20} strokeWidth={3} />}
          <p className="text-2xl font-black tracking-tighter  font-mono">
            {Math.abs(change || 0).toFixed(2)}<span className="text-sm ml-0.5">%</span>
          </p>
        </div>
      </div>

      {/* Subtle bottom scan-line to match PortfolioCard */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
    </div>
  );
}