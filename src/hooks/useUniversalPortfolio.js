import { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { getAlchemy } from "../lib/alchemy";
import { fetchTokenPrices, fetchNativePrice } from "../lib/prices";

const SUPPORTED_CHAINS = [1, 137, 56, 10, 42161, 8453, 143, 10143];

const NETWORKS = {
  1: {
    name: "Ethereum",
    symbol: "ETH",
    cgId: "ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  137: {
    name: "Polygon",
    symbol: "POL",
    cgId: "polygon-ecosystem",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  },
  56: {
    name: "BNB Smart Chain",
    symbol: "BNB",
    cgId: "binancecoin",
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  },
  10: {
    name: "Optimism",
    symbol: "OP",
    cgId: "optimism",
    logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
  },
  42161: {
    name: "Arbitrum",
    symbol: "ETH",
    cgId: "ethereum",
    logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
  },
  8453: {
    name: "Base",
    symbol: "ETH",
    cgId: "ethereum",
    logo: "https://cryptologos.cc/logos/base-base-logo.png",
  },
  143: {
    name: "Monad",
    symbol: "MON",
    cgId: "monad",
    logo: "https://cryptologos.cc/logos/monad-mon-logo.png",
  },
  10143: {
    name: "Monad Testnet",
    symbol: "MON",
    cgId: "monad",
    logo: "https://cryptologos.cc/logos/monad-mon-logo.png",
  },
};

const DEFAULT_TOKEN_LOGO =
  "https://etherscan.io/images/main/empty-token.png";

export const useUniversalPortfolio = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [assets, setAssets] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const [nativeBalanceInfo, setNativeBalanceInfo] = useState({
    balance: "0.00",
    symbol: "ETH",
    logo: "",
  });

  const getNetworkMeta = (id) =>
    NETWORKS[id] || {
      name: "Unknown",
      symbol: "Native",
      cgId: "ethereum",
      logo: DEFAULT_TOKEN_LOGO,
    };

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!isConnected || !address) return;

      setLoading(true);

      try {
        const chainData = await Promise.all(
          SUPPORTED_CHAINS.map(async (id) => {
            try {
              const alchemy = getAlchemy(id);
              const network = getNetworkMeta(id);

              const [nativeRaw, tokenData] = await Promise.all([
                alchemy.core.getBalance(address),
                alchemy.core.getTokenBalances(address),
              ]);

              const nativeBalance = Number(nativeRaw) / 1e18;

              const nativePriceData = await fetchNativePrice(network.cgId);
              const nativePrice = nativePriceData?.usd || 0;

              const activeTokens = tokenData.tokenBalances.filter(
                (t) =>
                  t.tokenBalance !==
                  "0x0000000000000000000000000000000000000000000000000000000000000000"
              );

              const resolvedTokens = await Promise.all(
                activeTokens.map(async (token) => {
                  try {
                    const meta = await alchemy.core.getTokenMetadata(
                      token.contractAddress
                    );

                    if (!meta?.symbol) return null;

                    const balance =
                      parseInt(token.tokenBalance) /
                      Math.pow(10, meta.decimals || 18);

                    if (balance <= 0) return null;

                    return {
                      contract: token.contractAddress,
                      name: meta.name,
                      symbol: meta.symbol,
                      logo: meta.logo || DEFAULT_TOKEN_LOGO,
                      balance,
                    };
                  } catch {
                    return null;
                  }
                })
              );

              const tokens = resolvedTokens.filter(Boolean);

              const tokenAddresses = tokens.map((t) => t.contract);

              const priceData =
                tokenAddresses.length > 0
                  ? await fetchTokenPrices(network.cgId, tokenAddresses)
                  : {};

              const tokenAssets = tokens.map((t) => {
                const price =
                  priceData[t.contract.toLowerCase()]?.usd || 0;

                return {
                  name: t.name,
                  symbol: t.symbol,
                  logo: t.logo,
                  balance: t.balance.toFixed(4),
                  price,
                  totalValue: t.balance * price,
                  change24h:
                    priceData[t.contract.toLowerCase()]?.usd_24h_change || 0,
                };
              });

              if (nativeBalance > 0) {
                tokenAssets.unshift({
                  name: network.name,
                  symbol: network.symbol,
                  logo: network.logo,
                  balance: nativeBalance.toFixed(4),
                  price: nativePrice,
                  totalValue: nativeBalance * nativePrice,
                  change24h: 0,
                });
              }

              return tokenAssets;
            } catch {
              return [];
            }
          })
        );

        const combinedAssets = chainData.flat();

        const sortedAssets = combinedAssets.sort(
          (a, b) => b.totalValue - a.totalValue
        );

        const total = sortedAssets.reduce(
          (sum, asset) => sum + asset.totalValue,
          0
        );

        setAssets(sortedAssets);
        setPortfolioValue(total);
      } catch (error) {
        console.error("Portfolio fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [address, isConnected]);

  useEffect(() => {
    const updateNativeBalance = async () => {
      if (!isConnected || !address) return;

      try {
        const alchemy = getAlchemy(chainId);
        const network = getNetworkMeta(chainId);

        const balanceRaw = await alchemy.core.getBalance(address);

        setNativeBalanceInfo({
          balance: (Number(balanceRaw) / 1e18).toFixed(4),
          symbol: network.symbol,
          logo: network.logo,
        });
      } catch (error) {
        console.error("Native balance error:", error);
      }
    };

    updateNativeBalance();
  }, [chainId, address, isConnected]);

  return {
    assets,
    loading,
    portfolioValue,
    nativeBalanceInfo,
  };
};