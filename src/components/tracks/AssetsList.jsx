import React from 'react';

const AssetList = ({ assets }) => {
  if (assets.length === 0) return (
    <div className="text-center py-20 text-gray-500">Enter a wallet address to analyze portfolio.</div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-20">
      <h3 className="text-white font-semibold mb-4">Your Assets</h3>
      
      {/* Desktop Table */}
      <div className="hidden md:block bg-[#111827]/30 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#111827] text-gray-400 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4">Balance</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {assets.map((asset, i) => (
              <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img src={asset.logo} className="w-8 h-8 rounded-full bg-gray-700" alt="" />
                  <div>
                    <div className="text-white font-medium">{asset.name}</div>
                    <div className="text-gray-500 text-xs">{asset.symbol}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300">{asset.balance}</td>
                <td className="px-6 py-4 text-gray-300">${asset.price}</td>
                <td className="px-6 py-4 text-right text-cyan-400 font-semibold">${asset.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards */}
      <div className="md:hidden space-y-3">
        {assets.map((asset, i) => (
          <div key={i} className="bg-[#111827]/50 border border-gray-800 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={asset.logo} className="w-10 h-10 rounded-full" alt="" />
              <div>
                <div className="text-white font-bold">{asset.symbol}</div>
                <div className="text-gray-500 text-xs">{asset.balance} tokens</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-cyan-400 font-bold">${asset.value}</div>
              <div className="text-gray-500 text-xs">${asset.price} / ea</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetList;