import React from 'react';

const getAvatarColor = (symbol) => {
  const colors = [
    'bg-blue-600', 'bg-purple-600', 'bg-pink-600', 
    'bg-indigo-600', 'bg-cyan-600', 'bg-teal-600', 
    'bg-orange-600', 'bg-emerald-600'
  ];
  const index = (symbol?.charCodeAt(0) || 0) % colors.length;
  return colors[index];
};

export default function AssetMobileList({ assets }) {
  if (!assets || assets.length === 0) return null;

  return (
    <div className="divide-y divide-white/5">
      {assets.map((a, i) => (
        <div key={i} className="p-4 flex justify-between items-center active:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-4 min-w-0">
            {/* Avatar */}
            <div className={`w-11 h-11 shrink-0 rounded-full ${getAvatarColor(a.symbol)} flex items-center justify-center border border-white/10`}>
              <span className="text-white text-sm font-black italic">{a.symbol?.slice(0, 2).toUpperCase()}</span>
            </div>
            
            {/* Asset Info */}
            <div className="min-w-0">
              <p className="text-white font-black text-sm truncate">{a.symbol}</p>
              <p className="text-gray-400 text-xs font-medium truncate">
                {a.balance} <span className="text-[10px] opacity-50">{a.symbol}</span>
              </p>
            </div>
          </div>
          
          {/* Values */}
          <div className="text-right shrink-0 ml-4">
            <p className="text-white font-black text-base">
              ${(a.totalValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-gray-500 text-[10px] font-bold">
              ${(a.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}