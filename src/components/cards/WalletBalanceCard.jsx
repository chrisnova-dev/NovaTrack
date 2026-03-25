import React from "react";

export default function WalletBalanceCard({ balance, isConnected, loading }) {
  if (loading) {
    return <div className="h-44 w-full bg-white/5 border border-white/10 rounded-[2.5rem] animate-pulse" />;
  }

  if (!isConnected) {
    return (
      <div className="backdrop-blur-xl p-8 rounded-[2.5rem] border border-cyan-500 h-35 flex flex-col justify-center  overflow-hidden transition-all shadow-xl">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
          {!isConnected ? "Awaiting Connection" : "Analyzing Assets..."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0E14]/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-cyan-500/10 h-35 flex flex-col justify-center  overflow-hidden group hover:border-cyan-500/30 transition-all shadow-xl">
      
      {/* Subtle background glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/5 blur-[40px] rounded-full" />

           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <span className="w-1 h-1 bg-cyan-500 rounded-full" />
        Native Asset
      </p>

      <div className="flex items-center gap-5">
        {/* LOGO */}
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
          {balance?.logo ? (
            <img 
              src={balance.logo} 
              className="w-full h-full object-cover scale-110" 
              alt="coin logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<span class="text-cyan-400 font-black text-xl">${balance?.symbol?.charAt(0)}</span>`;
              }}
            />
          ) : (
            <span className="text-cyan-400 font-black text-xl">
              {balance?.symbol?.charAt(0) || '?' }
            </span>
          )}
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-white text-3xl font-black tracking-tighter font-mono">
              {parseFloat(balance?.balance || 0).toFixed(4)}
            </h2>
            <span className="text-cyan-400 font-black text-xs uppercase tracking-tighter">
              {balance?.symbol}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
          </div>
        </div>
      </div>
    </div>
  );
}