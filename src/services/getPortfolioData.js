// File: getPortfolioData.js
import { alchemy } from "../lib/alchemy"; // Your centralized Alchemy instance
import { Network } from "alchemy-sdk";

/**
 * Fetch portfolio data for a wallet.
 * @param {string} walletAddress - The wallet to fetch balances for
 * @param {string} chain - Optional: "ethereum", "polygon", "bsc", etc.
 * @returns Array of token objects [{name, symbol, balance, logo, contract, usdPrice, totalValue}]
 */
export const getPortfolioData = async (walletAddress, chain = 'ethereum') => {
  if (!walletAddress) return [];

  try {
    // Fetch native balance
    const nativeBalanceRaw = await alchemy.core.getBalance(walletAddress, { network: Network[chain.toUpperCase()] });
    const nativeBalance = parseFloat(nativeBalanceRaw.toString() / 1e18).toFixed(4);

    // Fetch all token balances
    const balances = await alchemy.core.getTokenBalances(walletAddress, { network: Network[chain.toUpperCase()] });

    // Fetch token metadata in parallel
    const tokenPromises = balances.tokenBalances.map(async (token) => {
      const metadata = await alchemy.core.getTokenMetadata(token.contractAddress, { network: Network[chain.toUpperCase()] });

      const balance = (parseInt(token.tokenBalance) / Math.pow(10, metadata.decimals || 18)).toFixed(4);
      if (parseFloat(balance) === 0) return null;

      return {
        name: metadata.name || "Unknown Token",
        symbol: metadata.symbol || "???",
        logo: metadata.logo || "https://etherscan.io/images/main/empty-token.png",
        balance,
        contract: token.contractAddress,
        usdPrice: metadata.usdPrice || 0,
        totalValue: (balance * (metadata.usdPrice || 0)).toFixed(2),
      };
    });

    const resolvedTokens = (await Promise.all(tokenPromises)).filter(Boolean);

    // 4️⃣ Add native asset
    const nativeAsset = {
      name: chain === 'ethereum' ? "Ethereum" : chain.toUpperCase(),
      symbol: chain === 'ethereum' ? "ETH" : chain.slice(0, 3).toUpperCase(),
      logo: chain === 'ethereum'
        ? "https://cryptologos.cc/logos/ethereum-eth-logo.png"
        : "https://cryptologos.cc/logos/bitcoin-btc-logo.png", // placeholder for other chains
      balance: nativeBalance,
      contract: "native",
      usdPrice: 0,
      totalValue: 0,
    };

    return [nativeAsset, ...resolvedTokens];
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return [];
  }
};