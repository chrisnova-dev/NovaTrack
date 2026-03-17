import React from "react";

const AssetTable = ({ assets = [], isConnected, loading }) => {
  // 1. Loading Skeleton State
  if (loading) {
    return (
      <div className="bg-[#0a0b14]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-pulse">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
           <div className="h-6 w-32 bg-white/10 rounded-md"></div>
        </div>
        <div className="p-10 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                <div className="h-4 w-20 bg-white/10 rounded-md"></div>
              </div>
              <div className="h-4 w-24 bg-white/10 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Handle Disconnected State
  if (!isConnected) {
    return (
      <div className="bg-[#0a0b14]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-12 text-center shadow-lg">
        <div className="w-20 h-20 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
          <span className="text-3xl grayscale opacity-50">🔒</span>
        </div>
        <h4 className="text-white font-bold text-lg mb-2 tracking-tight">Portfolio Locked</h4>
        <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
          Connect your wallet to synchronize your multi-chain assets.
        </p>
      </div>
    );
  }

  // 3. Handle Empty Wallet
  if (assets.length === 0) {
    return (
      <div className="bg-[#0a0b14]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-12 text-center">
        <p className="text-gray-400 font-medium">No assets detected on this network.</p>
        <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest mt-2">Try switching networks</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0b14]/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
        <h3 className="text-white font-black text-lg md:text-xl tracking-tight">Your Assets</h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">
             Live
           </span>
        </div>
      </div>

      {/* Desktop Table - Hidden on Mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="px-8 py-5 text-gray-500 text-[10px] uppercase font-black tracking-widest">Coin</th>
              <th className="px-8 py-5 text-gray-500 text-[10px] uppercase font-black tracking-widest">Price</th>
              <th className="px-8 py-5 text-gray-500 text-[10px] uppercase font-black tracking-widest">Balance</th>
              <th className="px-8 py-5 text-gray-500 text-[10px] uppercase font-black tracking-widest text-right">Value (USD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {assets.map((token, index) => {
              const price = parseFloat(token.price || 0);
              const totalValue = parseFloat(token.totalValue || 0);
              const change = parseFloat(token.change24h || 0);

              return (
                <tr
                  key={index}
                  className="hover:bg-white/[0.02] transition-all duration-300 group cursor-default"
                >
                  <td className="px-8 py-6 flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={token.logo}
                        alt={token.symbol}
                        className="w-10 h-10 rounded-full border border-white/10 bg-[#161b2a] shadow-xl group-hover:scale-110 transition-transform"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${token.symbol}&background=1a202c&color=fff`; }}
                      />
                    </div>
                    <div>
                      <div className="text-white font-black text-base group-hover:text-purple-400 transition-colors">
                        {token.symbol}
                      </div>
                      <div className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter">
                        {token.name}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-8 py-6">
                    <div className="text-white text-sm font-mono font-medium">
                      ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="text-gray-300 text-sm font-bold font-mono">
                      {Number(token.balance).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </div>
                  </td>

                  <td className="px-8 py-6 text-right">
                    <div className="text-white text-lg font-black tracking-tighter font-mono">
                      ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Shown only on Mobile */}
      <div className="md:hidden divide-y divide-white/5 bg-white/[0.01]">
        {assets.map((token, index) => {
          const totalValue = parseFloat(token.totalValue || 0);
          const change = parseFloat(token.change24h || 0);

          return (
            <div key={index} className="p-5 flex items-center justify-between active:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <img
                  src={token.logo}
                  className="w-11 h-11 rounded-full border border-white/10 bg-slate-900"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${token.symbol}`; }}
                />
                <div>
                  <div className="text-white font-black text-base leading-none mb-1">{token.symbol}</div>
                  <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-none">
                    {Number(token.balance).toLocaleString(undefined, { maximumFractionDigits: 3 })} held
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-black text-lg tracking-tighter mb-0.5">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssetTable;