import React from 'react';
import { Search, Loader2 } from 'lucide-react';

const WalletInput = ({ onAnalyze, loading }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="bg-[#111827]/50 border border-gray-800 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
        <h2 className="text-white text-lg font-semibold mb-4">Analyze Wallet</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Paste wallet address (0x...)" 
              className="w-full bg-[#0B0E14] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>
          <button 
            onClick={onAnalyze}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 text-[#0B0E14] font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Analyze"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletInput;