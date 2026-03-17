import React from "react";
import { Wallet, ArrowUpRight, Lock } from "lucide-react";

const PortfolioCard = ({ totalValue, change24h, isConnected, loading }) => {
  // 1. Loading State
  if (loading) {
    return (
      <div className="h-44 w-full bg-white/5 border border-white/10 rounded-[2.5rem] animate-pulse" />
    );
  }

  // 2. Disconnected / Locked State
  if (!isConnected) {
    return (
      <div className="relative overflow-hidden h-44 w-full bg-[#0a0b14]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center items-center shadow-2xl">
        {/* Decorative Background Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full" />
        
        <div className="bg-white/5 p-3 rounded-2xl mb-3 border border-white/10">
          <Lock size={20} className="text-gray-500" />
        </div>
        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Portfolio Status</p>
        <h3 className="text-white/40 text-xl font-bold mt-1 tracking-tight italic">Wallet Locked</h3>
      </div>
    );
  }

  // 3. Active Portfolio State
  const isPositive = change24h >= 0;

  return (
    <div className="relative overflow-hidden w-full bg-gradient-to-br from-[#1a1c2e] to-[#0a0b14] border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group transition-all hover:border-purple-500/30">
      
      {/* Visual Accents */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Wallet size={80} className="text-white rotate-12" />
      </div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/10 blur-[60px] rounded-full" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]" />
          <span className="text-gray-400 text-[10px] md:text-[11px] uppercase font-black tracking-[0.2em]">
            Total Balance
          </span>
        </div>

        <h2 className="text-white text-3xl md:text-5xl font-black tracking-tighter mb-4 font-mono">
          ${totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h2>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black border ${
            isPositive 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            <ArrowUpRight size={14} className={isPositive ? "" : "rotate-90"} />
            {isPositive ? '+' : ''}{change24h}%
          </div>
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">
            vs yesterday
          </span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;