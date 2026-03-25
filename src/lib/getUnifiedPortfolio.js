import { SUPPORTED_CHAINS, getNetworkMeta } from "./networkMeta";
import { getAlchemy } from "./alchemy";
import { fetchAllNativePrices, fetchTokenPrices } from "./prices";

// In-memory token metadata cache
const tokenMetaCache = {};
const META_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Helper: limited concurrency async pool
const asyncPool = async (poolLimit, array, iteratorFn) => {
  const ret = [];
  const executing = [];
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);

    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) await Promise.race(executing);
    }
  }
  return Promise.all(ret);
};

// Fetch token metadata with cache
const getTokenMetadataCached = async (alchemy, contract) => {
  if (
    tokenMetaCache[contract] &&
    Date.now() - tokenMetaCache[contract].time < META_CACHE_TIME
  ) {
    return tokenMetaCache[contract].data;
  }
  const data = await alchemy.core.getTokenMetadata(contract);
  tokenMetaCache[contract] = { data, time: Date.now() };
  return data;
};

// Main unified portfolio fetch
export const getUnifiedPortfolio = async (walletAddress) => {
  if (!walletAddress) return { assets: [], totalValue: 0, change24h: 0 };

  const rawResults = await Promise.all(
    SUPPORTED_CHAINS.map(async (chainId) => {
      try {
        const alchemy = getAlchemy(chainId);
        const [nativeRaw, tokenData] = await Promise.all([
          alchemy.core.getBalance(walletAddress),
          alchemy.core.getTokenBalances(walletAddress),
        ]);
        return { chainId, nativeRaw, tokenData };
      } catch {
        return null;
      }
    }),
  );

  // Batch fetch native prices
  const uniqueCgIds = [
    ...new Set(SUPPORTED_CHAINS.map((id) => getNetworkMeta(id).cgId)),
  ];
  const nativePrices = await fetchAllNativePrices(uniqueCgIds);

  let allAssets = [];

  // Process each chain
  await Promise.all(
    rawResults.filter(Boolean).map(async (res) => {
      const network = getNetworkMeta(res.chainId);
      const priceData = nativePrices[network.cgId] || {
        usd: 0,
        usd_24h_change: 0,
      };

      // Native token
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

      // Tokens
      const activeTokens = res.tokenData.tokenBalances.filter(
        (t) => t.tokenBalance !== "0x0",
      );

      // Limit concurrency for metadata fetch
      const tokenMetas = await asyncPool(10, activeTokens, async (t) => {
        try {
          const m = await getTokenMetadataCached(
            getAlchemy(res.chainId),
            t.contractAddress,
          );
          const bal = parseInt(t.tokenBalance) / Math.pow(10, m.decimals || 18);
          return bal > 0.00001 ? { ...t, m, bal } : null;
        } catch {
          return null;
        }
      });

      const validTokens = tokenMetas.filter(Boolean);

      // Batch fetch token prices
      const tokenPrices = await fetchTokenPrices(
        network.cgId,
        validTokens.map((v) => v.contractAddress),
      );

      validTokens.forEach((v) => {
        const tp = tokenPrices[v.contractAddress.toLowerCase()] || {
          usd: 0,
          usd_24h_change: 0,
        };
        allAssets.push({
          name: v.m.name,
          symbol: v.m.symbol,
          logo: v.m.logo || "https://etherscan.io/images/main/empty-token.png",
          balance: v.bal.toFixed(4),
          price: tp.usd,
          totalValue: v.bal * tp.usd,
          change24h: tp.usd_24h_change || 0,
        });
      });
    }),
  );

  // Sort by totalValue
  const sorted = allAssets.sort((a, b) => b.totalValue - a.totalValue);

  const totalVal = sorted.reduce((sum, a) => sum + a.totalValue, 0);
  const topAsset = sorted[0] || null;

  // Add total amount as a number
  if (topAsset) {
    topAsset.value = topAsset.totalValue; // Keep value for display
  }
  const change24h =
    totalVal > 0
      ? sorted.reduce((sum, a) => sum + a.totalValue * a.change24h, 0) /
        totalVal
      : 0;

  return { assets: sorted, totalValue: totalVal, change24h };
};
