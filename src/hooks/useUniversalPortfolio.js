import { useState, useEffect, useCallback } from "react";
import { useAccount, useChainId } from "wagmi";
import { getNetworkMeta } from "../lib/networkMeta"; // Map of chainId → metadata
import { getAlchemy } from "../lib/alchemy";
import { getUnifiedPortfolio } from "../lib/getUnifiedPortfolio";

const savePortfolioSnapshot = (value) => {
  const existing = JSON.parse(localStorage.getItem("portfolioHistory")) || [];

  const newEntry = {
    time: Date.now(),
    value: value + (Math.random() - 0.5)*2,
  };

  const updated = [...existing, newEntry].slice(-30); // keep last 30

  localStorage.setItem("portfolioHistory", JSON.stringify(updated));
};

export const useUniversalPortfolio = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [assets, setAssets] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [topAsset, setTopAsset] = useState(null);
  const [totalAssets, setTotalAssets] = useState(0);
  const [portfolioChange24h, setPortfolioChange24h] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [nativeBalanceInfo, setNativeBalanceInfo] = useState({
    balance: "0.00",
    symbol: "ETH",
    logo: getNetworkMeta(1).logo,
  });

  const fetchPortfolio = useCallback(
    async (force = false) => {
      if (!isConnected || !address) return;
      setLoading(true);
      try {
        const {
          assets: unifiedAssets,
          totalValue,
          change24h,
        } = await getUnifiedPortfolio(address);
        setAssets(unifiedAssets);
        setPortfolioValue(totalValue);
        setPortfolioChange24h(change24h);
        setTopAsset(unifiedAssets[0] || null);
        setTotalAssets(unifiedAssets.length);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Unified Portfolio Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    },
    [address, isConnected],
  );

  useEffect(() => {
    const fetchQuickNativeBalance = async () => {
      if (!isConnected || !address || !chainId) return;
      try {
        const alchemy = getAlchemy(chainId);
        const bal = await alchemy.core.getBalance(address);
        const network = getNetworkMeta(chainId);
        setNativeBalanceInfo({
          balance: (Number(bal) / 1e18).toFixed(4),
          symbol: network.symbol,
          logo: network.logo,
        });
      } catch (error) {
        console.warn("Quick native balance failed:", error.message);
      }
    };
    fetchQuickNativeBalance();
  }, [chainId, address, isConnected]);

  // Initial fetch
  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  useEffect(() => {
    if (!isConnected || !portfolioValue) return;

    // Save instantly when value updates
    savePortfolioSnapshot(portfolioValue);

    // Track every 5 seconds
    const interval = setInterval(() => {
      savePortfolioSnapshot(portfolioValue);
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected, portfolioValue]);

  useEffect(() => {
    if (!isConnected) {
      setAssets([]);
      setPortfolioValue(0);
      setTopAsset(null);
      setTotalAssets(0);
      setPortfolioChange24h(0);
      setLastUpdated(null);

      localStorage.removeItem("portfolioHistory"); // clear chart
    }
  }, [isConnected]);

  return {
    assets,
    portfolioValue,
    topAsset,
    totalAssets,
    portfolioChange24h,
    nativeBalanceInfo,
    loading,
    lastUpdated,
    refresh: () => fetchPortfolio(true),
  };
};
