import React from "react";
import { Wallet, ArrowUpRight, Lock  } from "lucide-react";

const PortfolioCard = ({ totalValue, change24h, isConnected, loading }) => {
  // 1. Loading State - Updated to match the darker theme
  if (loading) {
    return (
      <div className="h-44 w-full  border border-cyan-500/10 rounded-[2.5rem] animate-pulse" />
    );
  }

  // 2. Disconnected / Locked State
  if (!isConnected) {
    return (
      <div className="relative overflow-hidden h-44 w-full  backdrop-blur-xl border border-cyan-500 rounded-[2.5rem] p-8 flex flex-col justify-center items-center shadow-2xl">
        {/* Swapped Purple Glow for Cyan */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full" />

        <div className="bg-cyan-500/5 p-3 rounded-2xl mb-3 border border-cyan-500/20">
          <Lock size={20} className="text-cyan-500/50" />
        </div>
        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">
          Portfolio Value
        </p>
        <h3 className="text-white/40 text-xl font-bold mt-1 tracking-tight">
          Connect Wallet
        </h3>
      </div>
    );
  }

  // 3. Active Portfolio State
  const isPositive = change24h >= 0;

  return (

    <div className="relative overflow-hidden w-full bg-[#0B0E14]/60 backdrop-blur-xl border border-cyan-500/20 rounded-[2.5rem] p-6 md:p-8 shadow-2xl group transition-all duration-500 hover:border-cyan-500/50 hover:shadow-cyan-500/5">
      {/* Visual Accents - Swapped Purple for Cyan */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Wallet size={80} className="text-cyan-400 rotate-12" />
      </div>

      {/* Background Glow inside the card */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-600/10 blur-[60px] rounded-full" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          {/* Status Dot: Cyan instead of Purple */}
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
          <span className="text-gray-400 text-[10px] md:text-[11px] uppercase font-black tracking-[0.2em]">
            Total Balance
          </span>
        </div>

        {/* Amount: Font bold/black for that tech-heavy look */}
        <h2 className="text-white text-3xl md:text-5xl font-black tracking-tighter mb-4 font-mono">
          ${totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h2>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black border ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}
          >
            <ArrowUpRight size={14} className={isPositive ? "" : "rotate-90"} />
            {isPositive ? "+" : ""}
            {change24h}%
          </div>
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">
            Performance
          </span>
        </div>
      </div>

      {/* Subtle bottom scan-line effect (Optional but cool for blockchain feel) */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

export default PortfolioCard;
