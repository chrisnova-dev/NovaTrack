import { useState, useEffect, useRef, useCallback } from "react";
import { useAccount, useChainId } from "wagmi";
import { getAlchemy } from "../lib/alchemy";
import { fetchTokenPrices, fetchAllNativePrices } from "../lib/prices";

const SUPPORTED_CHAINS = [1, 137, 56, 10, 42161, 8453, 143, 10143];

const NETWORKS = {
  1: { name: "Ethereum", symbol: "ETH", cgId: "ethereum", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  137: { name: "Polygon", symbol: "POL", cgId: "polygon-ecosystem", logo: "https://cryptologos.cc/logos/polygon-matic-logo.png" },
  56: { name: "BNB Smart Chain", symbol: "BNB", cgId: "binancecoin", logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
  10: { name: "Optimism", symbol: "OP", cgId: "optimism", logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png" },
  42161: { name: "Arbitrum", symbol: "ETH", cgId: "ethereum", logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png" },
  8453: { name: "Base", symbol: "ETH", cgId: "ethereum", logo: "https://cryptologos.cc/logos/base-base-logo.png" },
  143: { name: "Monad", symbol: "MON", cgId: "monad", logo: "https://cryptologos.cc/logos/monad-mon-logo.png" },
  10143: { name: "Monad Testnet", symbol: "MON", cgId: "monad", logo: "https://cryptologos.cc/logos/monad-mon-logo.png" },
};

const DEFAULT_TOKEN_LOGO = "https://etherscan.io/images/main/empty-token.png";

export const useUniversalPortfolio = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [assets, setAssets] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [topAsset, setTopAsset] = useState(null);
  const [totalAssets, setTotalAssets] = useState(0);
  const [portfolioChange24h, setPortfolioChange24h] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null); // New state for timestamp
  
  const lastFetchedAddress = useRef(null);

  const [nativeBalanceInfo, setNativeBalanceInfo] = useState({
    balance: "0.00",
    symbol: "ETH",
    logo: NETWORKS[1].logo,
  });

  const getNetworkMeta = (id) => NETWORKS[id] || { name: "Unknown", symbol: "Native", cgId: "ethereum", logo: NETWORKS[1].logo };

  // Wrapped in useCallback so it can be exported and called manually
  const fetchPortfolio = useCallback(async (force = false) => {
    if (!isConnected || !address) return;
    if (!force && lastFetchedAddress.current === address) return;

    setLoading(true);
    try {
      const rawResults = await Promise.all(
        SUPPORTED_CHAINS.map(async (id) => {
          try {
            const alchemy = getAlchemy(id);
            const [nativeRaw, tokenData] = await Promise.all([
              alchemy.core.getBalance(address),
              alchemy.core.getTokenBalances(address),
            ]);
            return { id, nativeRaw, tokenData };
          } catch { return null; }
        })
      );

      const uniqueCgIds = [...new Set(SUPPORTED_CHAINS.map(id => NETWORKS[id].cgId))];
      const priceMap = await fetchAllNativePrices(uniqueCgIds);

      let allAssets = [];

      for (const res of rawResults.filter(Boolean)) {
        const network = getNetworkMeta(res.id);
        const priceData = priceMap[network.cgId] || { usd: 0, usd_24h_change: 0 };
        const nativeBalance = Number(res.nativeRaw) / 1e18;

        if (nativeBalance > 0.0001) {
          allAssets.push({
            name: network.name,
            symbol: network.symbol,
            logo: network.logo,
            balance: nativeBalance.toFixed(4),
            price: priceData.usd,
            totalValue: nativeBalance * priceData.usd,
            change24h: priceData.usd_24h_change || 0,
          });
        }

        const activeTokens = res.tokenData.tokenBalances
          .filter(t => t.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000")
          .slice(0, 5);

        if (activeTokens.length > 0) {
          const alchemy = getAlchemy(res.id);
          const tokenMetas = await Promise.all(
            activeTokens.map(async (t) => {
              try {
                const m = await alchemy.core.getTokenMetadata(t.contractAddress);
                const bal = parseInt(t.tokenBalance) / Math.pow(10, m.decimals || 18);
                return bal > 0.00001 ? { ...t, m, bal } : null;
              } catch { return null; }
            })
          );

          const validTokens = tokenMetas.filter(Boolean);
          const tokenPrices = await fetchTokenPrices(network.cgId, validTokens.map(v => v.contractAddress));

          validTokens.forEach(v => {
            const tp = tokenPrices[v.contractAddress.toLowerCase()] || { usd: 0, usd_24h_change: 0 };
            allAssets.push({
              name: v.m.name,
              symbol: v.m.symbol,
              logo: v.m.logo || DEFAULT_TOKEN_LOGO,
              balance: v.bal.toFixed(4),
              price: tp.usd,
              totalValue: v.bal * tp.usd,
              change24h: tp.usd_24h_change || 0,
            });
          });
        }
      }

      const sorted = allAssets.sort((a, b) => b.totalValue - a.totalValue);
      const totalVal = sorted.reduce((s, a) => s + a.totalValue, 0);

      setAssets(sorted);
      setPortfolioValue(totalVal);
      setTopAsset(sorted[0] || null);
      setTotalAssets(sorted.length);
      setPortfolioChange24h(totalVal > 0 ? sorted.reduce((s, a) => s + (a.totalValue * a.change24h), 0) / totalVal : 0);
      
      setLastUpdated(new Date().toLocaleTimeString()); // Set the time
      lastFetchedAddress.current = address;
    } catch (error) {
      console.error("Portfolio Error:", error);
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  // Initial fetch on mount or address change
  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  useEffect(() => {
    const updateQuickBalance = async () => {
      if (!isConnected || !address) return;
      try {
        const alchemy = getAlchemy(chainId);
        const network = getNetworkMeta(chainId);
        const bal = await alchemy.core.getBalance(address);
        setNativeBalanceInfo({
          balance: (Number(bal) / 1e18).toFixed(4),
          symbol: network.symbol,
          logo: network.logo,
        });
      } catch {}
    };
    updateQuickBalance();
  }, [chainId, address, isConnected]);

  return { 
    assets, 
    loading, 
    portfolioValue, 
    nativeBalanceInfo, 
    topAsset, 
    totalAssets, 
    portfolioChange24h, 
    lastUpdated, 
    refresh: () => fetchPortfolio(true) // Export manual refresh
  };
};