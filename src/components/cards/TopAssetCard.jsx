import React from "react";

const TopAssetCard = ({ topAsset, isConnected }) => {
  
  // 1. If not connected, show a matching locked state
  if (!isConnected) {
    return (
      <div className="bg-[#1a202c] border border-white/10 rounded-2xl p-6 h-40 flex flex-col justify-center items-center">
        <p className="text-gray-500 text-sm font-medium">No Data Available</p>
      </div>
    );
  }

  // 2. If connected but no assets are found yet
  if (!topAsset) {
    return (
      <div className="bg-[#1a202c] border border-white/10 rounded-2xl p-6 h-40 flex flex-col justify-center items-center">
        <p className="text-gray-400 text-sm italic">Scanning Wallet...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a202c] border border-white/10 rounded-2xl p-6 h-40 flex flex-col justify-center">
      {/* Title */}
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
        Top Performing Asset
      </h3>

      <div className="flex items-center gap-4">
        {/* LOGO SECTION - Now matches the balance card */}
        <div className="w-12 h-12 rounded-full bg-[#2d3748] border border-white/5 flex items-center justify-center overflow-hidden">
          {topAsset.logo ? (
            <img 
              src={topAsset.logo} 
              alt={topAsset.symbol} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<span class="text-white font-bold">${topAsset.symbol?.charAt(0)}</span>`;
              }}
            />
          ) : (
            <span className="text-white font-bold">{topAsset.symbol?.charAt(0)}</span>
          )}
        </div>

        {/* TEXT SECTION */}
        <div>
          <p className="text-white font-bold text-xl leading-tight">
            {topAsset.symbol}
          </p>
          <p className="text-purple-400 font-mono font-bold text-lg mt-1">
            ${Number(topAsset.value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-gray-500 text-[10px] uppercase font-medium">
            Highest Value
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopAssetCard;