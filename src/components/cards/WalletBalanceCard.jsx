import React from "react";

export default function WalletBalanceCard({ balance, isConnected }) {
  
  // 1. If the wallet isn't connected, show a simple message
  if (!isConnected) {
    return (
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/10 flex flex-col justify-center items-center h-40">
        <p className="text-gray-500 text-sm font-medium">Wallet Not Connected</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/10 h-40 flex flex-col justify-center">
      
      {/* Title */}
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
        Wallet Balance
      </p>

      <div className="flex items-center gap-4">
        
        {/* LOGO SECTION */}
        <div className="w-12 h-12 rounded-full bg-[#1e293b] border border-white/5 flex items-center justify-center overflow-hidden">
          {balance?.logo ? (
            <img 
              src={balance.logo} 
              className="w-full h-full object-cover" 
              alt="coin logo"
              onError={(e) => {
                // If the logo link is broken, show a letter instead
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<span class="text-white font-bold">${balance?.symbol?.charAt(0) || '?' }</span>`;
              }}
            />
          ) : (
            // Fallback if there is no logo at all in the data
            <span className="text-white font-bold">
              {balance?.symbol?.charAt(0) || '?' }
            </span>
          )}
        </div>

        {/* TEXT SECTION */}
        <div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-white text-3xl font-bold">
              {balance?.balance || "0.00"}
            </h2>
            <span className="text-purple-400 font-bold text-sm">
              {balance?.symbol}
            </span>
          </div>
          <p className="text-gray-500 text-[10px] font-medium uppercase">
            Current Network
          </p>
        </div>

      </div>
    </div>
  );
}