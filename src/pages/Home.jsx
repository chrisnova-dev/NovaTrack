import React, { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { useUniversalPortfolio } from "../hooks/useUniversalPortfolio";
import { RefreshCw, Search } from "lucide-react";

// Cards & Assets
import PortfolioCard from "../components/cards/PortfolioCard";
import WalletBalanceCard from "../components/cards/WalletBalanceCard";
import TopAssetCard from "../components/cards/TopAssetCard";
import StatsCards from "../components/cards/StatsCards";
import AssetTable from "../components/assets/AssetTable";
import Spinner from "../components/assets/Spinner";
import PortfolioChart from "../components/PortfolioChart";

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
    refresh, // Ensure your hook exports a refresh function
  } = useUniversalPortfolio();

  // Filter assets based on search input
  const filteredAssets = useMemo(() => {
    return assets.filter(
      (a) =>
        a.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [assets, searchTerm]);

  return (
    <div className="min-h-screen px-5">
      <div className="">
        {/* Header section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Wallet Info Wrapper */}
          <div className="flex justify-between items-center w-full">
            <div>
              <p className="text-gray-500 font-medium mt-1">
                {isConnected
                  ? `Active Wallet: ${address?.slice(0, 6)}...${address?.slice(-4)}`
                  : "Connect your wallet to view assets"}
              </p>
            </div>

            {/* This button will now stay on the right even on mobile */}
            {isConnected && (
              <button
                onClick={() => refresh?.()}
                className={`p-2 rounded-full hover:bg-white/5 transition-transform ${
                  loading ? "animate-spin" : ""
                }`}
              >
                <RefreshCw size={20} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Top Card Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PortfolioCard
            totalValue={portfolioValue}
            change24h={portfolioChange24h}
            isConnected={isConnected}
            loading={loading}
          />
          <WalletBalanceCard
            balance={nativeBalanceInfo}
            isConnected={isConnected}
            loading={loading}
          />
          <TopAssetCard
            topAsset={topAsset}
            isConnected={isConnected}
            loading={loading}
          />
        </div>

        <StatsCards
          totalAssets={totalAssets}
          change={portfolioChange24h}
          isConnected={isConnected}
          loading={loading}
        />
      </div>

      <div>
        <PortfolioChart />
      </div>
      <div className="mt-12">
        {/* Flex container to push "Assets" left and Search right */}
        <div className="flex items-center justify-between mb-6">
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
             Assets List
      </p>

          {/* Search Input */}
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400/20 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0f1c2a] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-400/50 transition-all w-48 md:w-64"
            />
          </div>
        </div>

        {loading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <div>
            <div>
              <AssetTable assets={filteredAssets} isConnected={isConnected} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
