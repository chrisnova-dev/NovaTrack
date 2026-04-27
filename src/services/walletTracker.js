import { isAddress } from 'ethers';

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

// Network Mapping for Alchemy & GoPlus
const NETWORKS = {
  1: { name: "Ethereum", slug: "eth-mainnet", goplus: "1" },
  137: { name: "Polygon", slug: "polygon-mainnet", goplus: "137" },
  10: { name: "Optimism", slug: "opt-mainnet", goplus: "10" },
  42161: { name: "Arbitrum", slug: "arb-mainnet", goplus: "42161" },
  8453: { name: "Base", slug: "base-mainnet", goplus: "8453" },
  56: { name: "BSC", slug: "bnb-mainnet", goplus: "56" },
};

const getAlchemyUrl = (chainId) => `https://${NETWORKS[chainId]?.slug || 'eth-mainnet'}.g.alchemy.com/v2/${ALCHEMY_KEY}`;
const getGoPlusUrl = (chainId) => `https://api.gopluslabs.io/api/v1/token_security/${NETWORKS[chainId]?.goplus || '1'}`;
const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/token_price";

/**
 * --- UTILITIES ---
 */
const validateWallet = (address) => {
  if (!address) throw new Error("Wallet address is required.");
  if (!isAddress(address)) throw new Error("Invalid wallet address.");
  return true;
};

const formatUnits = (balance, decimals) => Number(balance) / Math.pow(10, decimals || 18);

/**
 * --- CORE SERVICES ---
 */

export async function getWalletPortfolio(walletAddress, chainId = 1) {
  try {
    validateWallet(walletAddress);
    const ALCHEMY_URL = getAlchemyUrl(chainId);

    // 1. Fetch Balances
    const [ethHex, tokenResponse] = await Promise.all([
      fetch(ALCHEMY_URL, {
        method: "POST",
        body: JSON.stringify({ jsonrpc: "2.0", method: "eth_getBalance", params: [walletAddress, "latest"], id: 1 })
      }).then(res => res.json()),
      fetch(ALCHEMY_URL, {
        method: "POST",
        body: JSON.stringify({ jsonrpc: "2.0", method: "alchemy_getTokenBalances", params: [walletAddress], id: 1 })
      }).then(res => res.json())
    ]);

    const assets = [];
    const ethBalance = formatUnits(parseInt(ethHex.result, 16), 18);
    
    if (ethBalance > 0) {
      assets.push({
        name: NETWORKS[chainId].name,
        symbol: NETWORKS[chainId].name === "Ethereum" ? "ETH" : "Native",
        balance: ethBalance,
        contract: "native",
        logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
        price: 0,
        value: 0 
      });
    }

    const activeTokens = (tokenResponse.result?.tokenBalances || [])
      .filter(t => t.tokenBalance !== "0")
      .slice(0, 20);

    // 2. Fetch Metadata
    for (const token of activeTokens) {
      const metaRes = await fetch(ALCHEMY_URL, {
        method: "POST",
        body: JSON.stringify({ jsonrpc: "2.0", method: "alchemy_getTokenMetadata", params: [token.contractAddress], id: 1 })
      }).then(res => res.json());

      const meta = metaRes.result;
      if (meta && meta.symbol) {
        assets.push({
          name: meta.name,
          symbol: meta.symbol,
          balance: formatUnits(token.tokenBalance, meta.decimals),
          contract: token.contractAddress,
          logo: meta.logo,
          price: 0,
          value: 0
        });
      }
    }

    // 3. Price Integration & USD Calculation
    const platform = chainId === 1 ? 'ethereum' : chainId === 137 ? 'polygon-pos' : 'binance-smart-chain';
    const contractList = assets.filter(a => a.contract !== 'native').map(a => a.contract).join(',');
    
    if (contractList) {
      const priceRes = await fetch(`${COINGECKO_URL}/${platform}?contract_addresses=${contractList}&vs_currencies=usd`).then(res => res.json());
      assets.forEach(asset => {
        if (asset.contract !== 'native' && priceRes[asset.contract.toLowerCase()]) {
          asset.price = priceRes[asset.contract.toLowerCase()].usd;
          asset.value = asset.balance * asset.price; // Sets actual USD balance
        }
      });
    }

    return {
      portfolioValue: assets.reduce((acc, curr) => acc + curr.value, 0),
      assets: assets.filter(a => a.balance > 0)
    };

  } catch (error) {
    throw new Error(error.message || "Unable to fetch data.");
  }
}

export async function checkTokenRisk(contractAddress, chainId = 1) {
  try {
    if (!isAddress(contractAddress)) throw new Error("Invalid contract address.");

    const response = await fetch(`${getGoPlusUrl(chainId)}?contract_addresses=${contractAddress}`);
    const data = await response.json();
    const security = data.result[contractAddress.toLowerCase()];
    
    if (!security) throw new Error("Security data unavailable.");

    const logs = [];
    let riskPoints = 0;

    // 1. Honeypot check
    if (security.is_honeypot === "1") { 
      logs.push("🚨 HONEYPOT: You cannot sell this token."); 
      riskPoints += 100; 
    } else {
      logs.push("✔ Honeypot check passed.");
    }

    // 2. Liquidity check
    const isLpLocked = security.lp_holders && security.lp_holders.length > 0;
    if (!isLpLocked) {
      logs.push("⚠ Liquidity might not be locked.");
      riskPoints += 20;
    } else {
      logs.push("✔ Liquidity locked.");
    }

    // 3. Ownership status
    const isRenounced = security.owner_address === "0x0000000000000000000000000000000000000000";
    if (!isRenounced) {
      logs.push("⚠ Ownership not renounced.");
      riskPoints += 15;
    } else {
      logs.push("✔ Ownership renounced.");
    }

    // 4. Additional Red Flags
    if (parseFloat(security.buy_tax) > 0.1 || parseFloat(security.sell_tax) > 0.1) {
       logs.push(`⚠ High Tax: ${(security.buy_tax * 100).toFixed(0)}% Buy / ${(security.sell_tax * 100).toFixed(0)}% Sell`);
       riskPoints += 20;
    }
    if (security.is_mintable === "1") { 
      logs.push("⚠ Mintable: Owner can create more tokens."); 
      riskPoints += 15; 
    }

    return {
      score: riskPoints,
      level: riskPoints > 50 ? "High Risk" : riskPoints > 15 ? "Moderate" : "Safe",
      warnings: logs,
      details: {
        isMintable: security.is_mintable === "1",
        isHoneypot: security.is_honeypot === "1",
        buyTax: security.buy_tax,
        sellTax: security.sell_tax,
        isLpLocked: isLpLocked,
        liquiditySize: security.liquidity || "0", // Total liquidity in USD
        ownerRenounced: isRenounced
      }
    };
  } catch (error) {
    throw new Error("Failed to analyze token.");
  }
}