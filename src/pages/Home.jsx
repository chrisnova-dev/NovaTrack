import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import DashboardCard from "../components/DashboardCard";
import AssetTable from "../components/AssetTable";
import { useUniversalPortfolio } from "../hooks/useUniversalPortfolio";

const DotLoader = () => {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex gap-2">
        <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:.15s]"></span>
        <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:.3s]"></span>git
      </div>
    </div>
  );
};

const Home = () => {
  const { address, isConnected } = useAccount();

  const {
    assets,
    loading,
    portfolioValue,
    nativeBalanceInfo,
    dayChange,
    topAsset,
    totalAssetsCount,
  } = useUniversalPortfolio();

  const isGaining = dayChange >= 0;

  useEffect(() => {
    if (isConnected && address) {
      console.log("Portfolio synced for:", address);
    }
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-400">
        Connect your wallet to view portfolio
      </div>
    );
  }

  if (loading) {
    return <DotLoader />;
  }

  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(portfolioValue);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white/90 mb-3 tracking-tight">
          NovaTrack Dashboard
        </h1>

        <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
          Real-time insights into your EVM assets, tokens, and portfolio
          performance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">

          {/* Portfolio Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* GLOBAL BALANCE */}
            <DashboardCard
              title="Total Portfolio Value"
              value={
                <span className="font-mono text-3xl md:text-4xl font-black tracking-tight text-white">
                  {formattedValue}
                </span>
              }
              subtitle="Global wallet valuation"
            />

            {/* NETWORK BALANCE */}
            <DashboardCard
              title="Native Network Balance"
              value={
                <span className="font-mono text-2xl font-bold text-white">
                  {nativeBalanceInfo.balance} {nativeBalanceInfo.symbol}
                </span>
              }
              subtitle="Selected network balance"
              icon={nativeBalanceInfo.logo}
              loading={loading}
            />
          </div>

          {/* Chart Area */}
          <div className="bg-gradient-to-br from-[#1a202c] to-[#111827] border border-white/10 rounded-[2rem] p-8 h-[350px] relative shadow-2xl overflow-hidden">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-300 font-semibold tracking-wide">
                Portfolio Performance
              </h3>

              <div className="flex gap-2 bg-[#2d3748] p-1 rounded-xl">
                {["1D", "7D", "1M", "1Y"].map((range) => (
                  <button
                    key={range}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      range === "7D"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-48 flex flex-col items-center justify-center text-gray-500 italic">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent mb-4" />
              <p className="text-sm font-light tracking-widest uppercase">
                Chart Coming Soon
              </p>
            </div>
          </div>

          {/* Asset Table */}
          <div className="bg-[#1a202c] border border-white/10 rounded-[2rem] shadow-xl overflow-hidden">

            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-lg text-white">
                Your Assets
              </h3>

              <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400">
                {assets.length} Tokens
              </span>
            </div>

            <AssetTable assets={assets} isConnected={isConnected} />

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-8">

          {/* TOP ASSET */}
          <div className="bg-gradient-to-br from-[#1a202c] to-[#2d3748] border border-white/10 rounded-[2rem] p-8 shadow-2xl">

            <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-6 font-bold">
              Primary Asset
            </h3>

            <div className="flex items-center gap-5">

              <div className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">

                {topAsset?.logo ? (
                  <img
                    src={topAsset.logo}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <span className="text-white font-black">?</span>
                )}

              </div>

              <div>

                <p className="font-black text-white text-lg">
                  {topAsset?.name || "Searching..."}
                </p>

                <div className="flex items-center gap-2">

                  <p className="text-2xl text-white font-bold font-mono">
                    ${Number(topAsset?.change24h || 0).toFixed(2)}
                  </p>

                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                      Number(topAsset?.change24h) >= 0
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {Number(topAsset?.change24h) >= 0 ? "+" : ""}
                    {Number(topAsset?.change24h || 0).toFixed(2)}%
                  </span>

                </div>
              </div>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-[#1a202c] border border-white/10 p-6 rounded-3xl text-center">
              <p className="text-3xl font-black text-white font-mono">
                {totalAssetsCount}
              </p>
              <p className="text-gray-500 text-[10px] uppercase font-bold mt-2">
                Assets Held
              </p>
            </div>

            <div className="bg-[#1a202c] border border-white/10 p-6 rounded-3xl text-center">

              <p
                className={`text-2xl font-black font-mono ${
                  isGaining ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isGaining ? "+" : ""}
                {(dayChange || 0).toFixed(2)}%
              </p>

              <p className="text-gray-500 text-[10px] uppercase font-bold mt-2">
                24h Growth
              </p>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Home);