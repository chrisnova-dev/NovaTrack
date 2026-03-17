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

export default function AssetTable({ assets }) {
  if (!assets || assets.length === 0) return null;

  return (
    <table className="w-full border-collapse">
      <thead className="bg-white/[0.03] text-gray-500 text-[10px] uppercase tracking-[0.2em] border-b border-white/10">
        <tr>
          <th className="p-5 text-left font-bold">Asset</th>
          <th className="p-5 text-right font-bold">Holdings</th>
          <th className="p-5 text-right font-bold">Price</th>
          <th className="p-5 text-right font-bold">Total Value</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {assets.map((a, i) => (
          <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
            <td className="p-5">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 shrink-0 rounded-full ${getAvatarColor(a.symbol)} flex items-center justify-center border border-white/10 shadow-lg`}>
                  <span className="text-white text-xs font-black italic">{a.symbol?.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm truncate">{a.symbol}</p>
                  <p className="text-gray-500 text-[10px] font-medium uppercase truncate">{a.name}</p>
                </div>
              </div>
            </td>
            <td className="p-5 text-right">
              <p className="text-gray-200 font-semibold text-sm">{a.balance}</p>
              <p className="text-gray-600 text-[10px] font-bold uppercase">{a.symbol}</p>
            </td>
            <td className="p-5 text-right text-gray-400 font-medium text-sm">
              ${(a.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </td>
            <td className="p-5 text-right">
              <p className="text-white font-black text-base">
                ${(a.totalValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}