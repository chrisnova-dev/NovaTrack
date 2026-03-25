import React from "react";
import { TrendingUp, Activity } from "lucide-react";

const TopAssetCard = ({ topAsset, isConnected, loading }) => {
  
  // 1. Loading / Disconnected States (Matched to PortfolioCard style)
  if (loading || !isConnected || !topAsset) {
    return (
      <div className=" backdrop-blur-xl p-8 rounded-[2.5rem] border border-cyan-500 h-35 flex flex-col justify-center  overflow-hidden transition-all shadow-xl">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
          {!isConnected ? "Awaiting Connection" : "Analyzing Assets..."}
        </p>
      </div>
    );
  }

  return (
    <div className=" backdrop-blur-xl p-8 rounded-[2.5rem] border border-cyan-500/10 h-35 flex flex-col justify-center  overflow-hidden group hover:border-cyan-500/30 transition-all shadow-xl">

            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <span className="w-1 h-1 bg-cyan-500 rounded-full" />
        Top Asset
      </p>




      <div className="flex items-center gap-5 relative z-10">
        {/* LOGO SECTION */}
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
          {topAsset.logo ? (
            <img 
              src={topAsset.logo} 
              alt={topAsset.symbol} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<span class="text-cyan-400 font-black text-xl">${topAsset.symbol?.charAt(0)}</span>`;
              }}
            />
          ) : (
            <span className="text-cyan-400 font-black text-xl">{topAsset.symbol?.charAt(0)}</span>
          )}
        </div>

        {/* DATA SECTION */}
        <div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-white text-xl font-black  font tracking-tighter">
              {topAsset.symbol}
            </h2>
          </div>
          
          <p className="text-cyan-400 font-black text-xl mt-0.5 tracking-tight font-mono">
            ${Number(topAsset.totalValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopAssetCard;