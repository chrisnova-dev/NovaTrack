import React from "react";

const AssetTable = ({ assets = [], isConnected, loading }) => {
  // 1. Loading Skeleton State
  if (loading) {
    return (
      <div className="bg-[#1a202c] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-pulse">
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
      <div className="bg-[#1a202c] border border-white/10 rounded-[2rem] p-12 text-center shadow-lg">
        <div className="w-20 h-20 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
          <span className="text-3xl grayscale opacity-50">🔒</span>
        </div>
        <h4 className="text-white font-bold text-lg mb-2">Portfolio Locked</h4>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          Connect your wallet to automatically fetch and calculate your global EVM assets.
        </p>
      </div>
    );
  }

  // 3. Handle Empty Wallet
  if (assets.length === 0) {
    return (
      <div className="bg-[#1a202c] border border-white/10 rounded-[2rem] p-12 text-center">
        <p className="text-gray-500 font-medium">No assets detected on this network.</p>
        <p className="text-gray-600 text-xs mt-1">Try switching to Ethereum or BNB Chain.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a202c] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
        <h3 className="text-white font-bold text-lg">Your Assets</h3>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">
             Live Data
           </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="px-6 py-4 text-gray-400 text-[10px] uppercase font-bold tracking-[0.1em]">Asset</th>
              <th className="px-6 py-4 text-gray-400 text-[10px] uppercase font-bold tracking-[0.1em]">Price</th>
              <th className="px-6 py-4 text-gray-400 text-[10px] uppercase font-bold tracking-[0.1em]">Balance</th>
              <th className="px-6 py-4 text-gray-400 text-[10px] uppercase font-bold tracking-[0.1em] text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {assets.map((token, index) => {
              const price = parseFloat(token.price || 0);
              const totalValue = parseFloat(token.totalValue || 0);
              const change = parseFloat(token.change24h || 0);

              return (
                <tr
                  key={index}
                  className="hover:bg-white/[0.03] transition-colors group cursor-default"
                >
                  <td className="px-6 py-5 flex items-center gap-4">
                    <img
                      src={token.logo}
                      alt={token.symbol}
                      className="w-10 h-10 rounded-full border border-white/10 bg-slate-800 shadow-inner"
                      onError={(e) => { 
                        e.target.src = `https://ui-avatars.com/api/?name=${token.symbol}&background=1a202c&color=fff`; 
                      }}
                    />
                    <div>
                      <div className="text-white font-bold group-hover:text-purple-400 transition-colors">
                        {token.symbol}
                      </div>
                      <div className="text-gray-500 text-xs font-medium">
                        {token.name}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-5">
                    <div className="text-white text-sm font-semibold">
                      ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[10px] font-bold mt-1 ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="text-white text-sm font-bold">
                      {Number(token.balance).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </div>
                    <div className="text-gray-500 text-[9px] font-black uppercase tracking-tighter opacity-60">
                      Available
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <div className="text-white text-base font-black tracking-tight">
                      ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-gray-500 text-[10px] font-bold">
                      USD
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetTable;