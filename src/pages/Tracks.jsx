import React, { useState } from 'react';
import { Search, Loader2, ShieldAlert, Wallet, CheckCircle2, AlertTriangle, TrendingUp, Layers, Info, Ban, Globe } from 'lucide-react';
import { getWalletPortfolio, checkTokenRisk } from '../services/walletTracker';

// Network list to match logic
const NETWORKS = [
  { id: 1, name: "Ethereum" },
  { id: 137, name: "Polygon" },
  { id: 56, name: "BSC" },
  { id: 8453, name: "Base" },
  { id: 42161, name: "Arbitrum" }
];

const Analyzer = () => {
  const [activeTab, setActiveTab] = useState("portfolio"); // "portfolio" or "risk"
  const [selectedChain, setSelectedChain] = useState(1); // Track selected network
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Data States
  const [portfolio, setPortfolio] = useState(null);
  const [riskData, setRiskData] = useState(null);

  const handleAction = async () => {
    if (!address) return setError("Please enter an address.");
    setLoading(true);
    setError("");

    try {
      if (activeTab === "portfolio") {
        const data = await getWalletPortfolio(address, selectedChain);
        const filtered = data.assets.filter(a => a.balance > 0);
        setPortfolio({ ...data, assets: filtered });
        setRiskData(null);
      } else {
        const data = await checkTokenRisk(address, selectedChain);
        setRiskData(data);
        setPortfolio(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Toggle Switch & Network Selector */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="bg-[#111827] p-1 rounded-xl border border-gray-800 flex gap-1">
            <button 
              onClick={() => { setActiveTab("portfolio"); setError(""); setPortfolio(null); }}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "portfolio" ? "bg-cyan-500 text-[#0B0E14]" : "text-gray-400 hover:text-white"}`}
            >
              Wallet Tracker
            </button>
            <button 
              onClick={() => { setActiveTab("risk"); setError(""); setRiskData(null); }}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "risk" ? "bg-cyan-500 text-[#0B0E14]" : "text-gray-400 hover:text-white"}`}
            >
              Risk Scanner
            </button>
          </div>

          <div className="flex items-center gap-2 bg-[#111827] border border-gray-800 px-4 py-2 rounded-xl">
            <Globe className="w-4 h-4 text-cyan-500" />
            <select 
              value={selectedChain} 
              onChange={(e) => { setSelectedChain(Number(e.target.value)); setPortfolio(null); setRiskData(null); }}
              className="bg-transparent text-xs font-bold outline-none cursor-pointer text-gray-300 hover:text-white"
            >
              {NETWORKS.map(net => (
                <option key={net.id} value={net.id} className="bg-[#111827]">{net.name} Network</option>
              ))}
            </select>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-[#111827]/50 border border-gray-800 backdrop-blur-xl p-6 rounded-2xl mb-8 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            {activeTab === "portfolio" ? <Wallet className="text-cyan-400" /> : <ShieldAlert className="text-cyan-400" />}
            {activeTab === "portfolio" ? "Analyze Portfolio" : "Scan Token Risk"}
          </h2>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={activeTab === "portfolio" ? "Paste wallet address..." : "Paste contract address..."} 
                className="w-full bg-[#0B0E14] border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:border-cyan-500 outline-none transition-all"
              />
            </div>
            <button 
              onClick={handleAction}
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-400 text-[#0B0E14] font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Run Scan"}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-3">⚠ {error}</p>}
        </div>

        {/* PORTFOLIO VIEW */}
        {activeTab === "portfolio" && portfolio && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#111827]/50 border border-gray-800 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Total Balance</p>
                  <h3 className="text-3xl font-black text-cyan-400">${portfolio.portfolioValue.toLocaleString()}</h3>
                </div>
                <TrendingUp className="text-gray-700 w-10 h-10" />
              </div>
              <div className="bg-[#111827]/50 border border-gray-800 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Token Count</p>
                  <h3 className="text-3xl font-black">{portfolio.assets.length}</h3>
                </div>
                <Layers className="text-gray-700 w-10 h-10" />
              </div>
            </div>

            <div className="bg-[#111827]/30 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-800 font-bold text-sm">Token Holdings</div>
                {portfolio.assets.map((asset, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-white/[0.02] border-b border-gray-800 last:border-0">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                         {asset.logo ? <img src={asset.logo} className="w-full h-full object-cover rounded-full" alt="" /> : asset.symbol[0]}
                       </div>
                       <div>
                         <p className="font-bold">{asset.name}</p>
                         <p className="text-xs text-gray-500">{asset.symbol}</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="font-bold text-white">{asset.balance.toFixed(4)}</p>
                       <p className="text-xs text-cyan-500">${asset.value.toLocaleString()}</p>
                     </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* RISK SCANNER VIEW */}
        {activeTab === "risk" && riskData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className={`p-8 rounded-3xl border-2 text-center ${
              riskData.level === 'Safe' ? 'border-green-500/20 bg-green-500/5' : 
              riskData.level === 'High Risk' ? 'border-red-500/20 bg-red-500/5' : 'border-yellow-500/20 bg-yellow-500/5'
            }`}>
               <p className="text-gray-500 text-xs uppercase font-bold mb-1">Safety Rating</p>
               <h2 className={`text-4xl font-black ${
                 riskData.level === 'Safe' ? 'text-green-400' : 
                 riskData.level === 'High Risk' ? 'text-red-400' : 'text-yellow-400'
               }`}>{riskData.level}</h2>
               <p className="text-gray-500 text-[10px] font-bold mt-2 tracking-widest uppercase">Risk Score: {riskData.score}/100</p>
            </div>

            {/* Beginner Guide Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Technical Overview */}
              <div className="bg-[#111827]/50 border border-gray-800 p-6 rounded-2xl">
                <h4 className="text-xs font-black text-gray-500 mb-4 tracking-widest uppercase flex items-center gap-2"><Info className="w-3 h-3" /> Technical Analysis</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Liquidity (USD)</span>
                    <span className="text-white font-bold">${Number(riskData.details.liquiditySize).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">LP Locked</span>
                    <span className={riskData.details.isLpLocked ? "text-green-500" : "text-red-500"}>{riskData.details.isLpLocked ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Ownership</span>
                    <span className={riskData.details.ownerRenounced ? "text-green-500" : "text-yellow-500"}>{riskData.details.ownerRenounced ? "Renounced" : "Active Owner"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Buy / Sell Tax</span>
                    <span className="text-white font-mono">{(riskData.details.buyTax * 100).toFixed(1)}% / {(riskData.details.sellTax * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Security Warnings */}
              <div className="bg-[#111827]/50 border border-gray-800 p-6 rounded-2xl flex flex-col justify-center">
                <h4 className="text-xs font-black text-gray-500 mb-4 tracking-widest uppercase flex items-center gap-2"><Ban className="w-3 h-3" /> Security Flags</h4>
                <div className="space-y-3">
                   {riskData.warnings.map((msg, i) => (
                     <div key={i} className="flex gap-3">
                        {riskData.level === 'Safe' ? <CheckCircle2 className="text-green-500 shrink-0 w-4 h-4" /> : <AlertTriangle className="text-red-500 shrink-0 w-4 h-4" />}
                        <p className="text-xs text-gray-300 leading-tight">{msg}</p>
                     </div>
                   ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl text-center">
               <p className="text-gray-500 text-[11px] leading-relaxed italic">
                 "NovaTrack Tip: High taxes (over 10%) or 'Mintable' status are major red flags for beginners."
               </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!portfolio && !riskData && !loading && (
          <div className="text-center py-20 opacity-20">
            <Wallet className="w-20 h-20 mx-auto mb-4" />
            <p>Paste an address above to generate report</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Analyzer;