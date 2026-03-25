import React from 'react';

export default function AssetTable({ assets, isConnected }) {
  // If not connected, show the 5-line "System Offline" state
  if (!isConnected) {
    return (
      <div className="relative w-full py-20 border border-white/5 flex flex-col items-center justify-center overflow-hidden">
        {/* Five Demarcation Lines */}
        <div className="absolute inset-0 flex flex-col justify-evenly px-10 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-px w-full bg-cyan-500" />
          ))}
        </div>
        
        {/* <div className="relative z-10 text-center">
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.4em] mb-2">Data Encrypted</p>
          <h3 className="text-white/20 text-lg font-bold">Awaiting Wallet Authentication</h3>
        </div> */}
      </div>
    );
  }

  if (!assets || assets.length === 0) return null;

  return (
    /* Wrap in overflow-x-auto to make it look nice/scrollable on mobile */
    <div className="w-full overflow-x-auto scrollbar-hide">
      <table className="w-full border-collapse bg-transparent min-w-[600px]">
        <thead className="text-slate-500 text-[10px] uppercase tracking-[0.3em] border-b border-white/5">
          <tr>
            <th className="p-6 text-left font-black">Asset</th>
            <th className="p-6 text-right font-black">Holdings</th>
            <th className="p-6 text-right font-black">Price</th>
            <th className="p-6 text-right font-black">Total Value</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {assets.map((a, i) => (
            <tr 
              key={`${a.symbol}-${i}`} 
              className="group hover:bg-cyan-500/[0.03] transition-colors duration-300"
            >
              <td className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-cyan-500/40 transition-all">
                    {a.logo ? (
                      <img 
                        src={a.logo} 
                        alt={a.symbol} 
                        className="w-full h-full object-cover p-1.5"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<span class="text-cyan-400 font-black text-xs">${a.symbol?.charAt(0)}</span>`;
                        }}
                      />
                    ) : (
                      <span className="text-cyan-400 font-black text-xs">{a.symbol?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm tracking-tight">{a.symbol}</p>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest truncate">{a.name}</p>
                  </div>
                </div>
              </td>

              <td className="p-6 text-right">
                <p className="text-slate-200 font-mono font-bold text-sm">{a.balance}</p>
                <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">{a.symbol}</p>
              </td>

              <td className="p-6 text-right">
                <p className="text-slate-400 font-mono text-sm">
                  ${(a.currentPrice || a.price || 0).toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 6 
                  })}
                </p>
              </td>

              <td className="p-6 text-right">
                <div className="flex flex-col items-end">
                  <p className="text-cyan-400 font-mono font-black text-base leading-none mb-1">
                    ${(a.totalValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <div className="h-[1px] w-0 bg-cyan-400 group-hover:w-full transition-all duration-500 opacity-30" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}