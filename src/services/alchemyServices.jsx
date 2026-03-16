
import { alchemy } from "../lib/alchemy"; 
import { Network } from "alchemy-sdk"; // Keep this if you need Network names


export const getPortfolioData = async (walletAddress) => {
  if (!walletAddress) return [];

  try {
    // 2. Fetch Native Balance (ETH) - This now uses your centralized key!
    const nativeBalanceRaw = await alchemy.core.getBalance(walletAddress);
    const nativeBalance = parseFloat(nativeBalanceRaw.toString() / 1e18).toFixed(4);

    // 3. Fetch all ERC-20 token balances
    const balances = await alchemy.core.getTokenBalances(walletAddress);

    const tokenPromises = balances.tokenBalances.map(async (token) => {
      const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
      
      const balance = (
        parseInt(token.tokenBalance) / Math.pow(10, metadata.decimals || 18)
      ).toFixed(4);

      if (parseFloat(balance) === 0) return null;

      return {
        name: metadata.name || "Unknown Token",
        symbol: metadata.symbol || "???",
        logo: metadata.logo || "https://etherscan.io/images/main/empty-token.png",
        balance: balance,
        contract: token.contractAddress,
        usdPrice: 0, 
        totalValue: 0,
      };
    });

    const resolvedTokens = (await Promise.all(tokenPromises)).filter(t => t !== null);
    
    const ethAsset = {
      name: "Ethereum",
      symbol: "ETH",
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      balance: nativeBalance,
      contract: "native",
      usdPrice: 0, 
      totalValue: 0,
    };

    return [ethAsset, ...resolvedTokens];
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return [];
  }
};