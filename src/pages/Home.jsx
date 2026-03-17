import React, { useState, useMemo } from "react";
import { useAccount } from 'wagmi'; 
import { useUniversalPortfolio } from "../hooks/useUniversalPortfolio";
import { RefreshCw, Search } from "lucide-react";

// Cards & Assets
import PortfolioCard from "../components/cards/PortfolioCard";
import WalletBalanceCard from "../components/cards/WalletBalanceCard";
import TopAssetCard from "../components/cards/TopAssetCard";
import StatsCards from "../components/cards/StatsCards";
import AssetTable from "../components/assets/AssetTable";
import AssetMobileList from "../components/assets/AssetMobileList";
import Spinner from "../components/assets/Spinner";

export default function Home() {
  const { isConnected, address } = useAccount(); 
  const [searchTerm, setSearchTerm] = useState("");
  
  const {
    assets,
    loading,
    portfolioValue,
    nativeBalanceInfo,
    topAsset,
    totalAssets,
    portfolioChange24h,
    chartData,
    refresh // Ensure your hook exports a refresh function
  } = useUniversalPortfolio();

  // Filter assets based on search input
  const filteredAssets = useMemo(() => {
    return assets.filter(a => 
      a.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assets, searchTerm]);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-purple-500/30 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        {/* Header section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic flex items-center gap-3">
              Market Overview
              {isConnected && (
                <button 
                  onClick={() => refresh?.()} 
                  className={`p-2 rounded-full hover:bg-white/5 transition-transform ${loading ? 'animate-spin' : ''}`}
                >
                  <RefreshCw size={20} className="text-gray-500" />
                </button>
              )}
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              {isConnected 
                ? `Active Wallet: ${address?.slice(0,6)}...${address?.slice(-4)}` 
                : "Connect your wallet to view assets"}
            </p>
          </div>
          

        </div>

        {/* Top Card Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PortfolioCard totalValue={portfolioValue} change24h={portfolioChange24h} isConnected={isConnected} loading={loading} />
          <WalletBalanceCard balance={nativeBalanceInfo} isConnected={isConnected} loading={loading} />
          <TopAssetCard topAsset={topAsset} isConnected={isConnected} loading={loading} />
        </div>

        {/* Middle Performance & Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-[#0f172a] rounded-[2rem] p-6 md:p-8 border border-white/10 min-h-[300px] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Performance Trend</h3>
              <span className="text-[10px] text-purple-400 font-bold bg-purple-400/10 px-2 py-1 rounded">7D History</span>
            </div>
            
            {!isConnected ? (
              <div className="flex-1 flex items-center justify-center text-gray-700 italic text-sm">Connect wallet to unlock chart</div>
            ) : (
              <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 pt-4">
                {(chartData || [30, 45, 35, 60, 55, 80, 75]).map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-600/10 to-purple-500/40 border-t-2 border-purple-500 rounded-t-lg transition-all duration-1000 group-hover:to-purple-400/60"
                      style={{ height: `${val}%` }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <StatsCards totalAssets={totalAssets} change={portfolioChange24h} isConnected={isConnected} loading={loading} />
        </div>

        {/* Asset List Section */}
        <div className="mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 px-2">
            <h2 className="text-xl font-bold tracking-tight">Your Portfolio Assets</h2>
            
            {/* Search Input */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={16} />
              <input 
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#0f172a] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all w-full md:w-64"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20 bg-[#0f172a] rounded-[2rem] border border-white/10">
              <Spinner />
            </div>
          ) : (
            <div className="bg-[#0f172a] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
              <div className="hidden md:block">
                <AssetTable assets={filteredAssets} />
              </div>
              <div className="block md:hidden">
                <AssetMobileList assets={filteredAssets} />
              </div>
              {filteredAssets.length === 0 && !loading && (
                <div className="p-20 text-center text-gray-500 italic">No assets match your search.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}