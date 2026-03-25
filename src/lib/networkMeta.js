// File: networkMeta.js
export const NETWORKS = {
  1: { name: "Ethereum", symbol: "ETH", cgId: "ethereum", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  137: { name: "Polygon", symbol: "POL", cgId: "polygon-ecosystem", logo: "https://cryptologos.cc/logos/polygon-matic-logo.png" },
  56: { name: "BNB Smart Chain", symbol: "BNB", cgId: "binancecoin", logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
  10: { name: "Optimism", symbol: "OP", cgId: "optimism", logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png" },
  42161: { name: "Arbitrum", symbol: "ETH", cgId: "ethereum", logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png" },
  8453: { name: "Base", symbol: "ETH", cgId: "ethereum", logo: "https://cryptologos.cc/logos/base-base-logo.png" },
  143: { name: "Monad", symbol: "MON", cgId: "monad", logo: "https://cryptologos.cc/logos/monad-mon-logo.png" },
  10143: { name: "Monad Testnet", symbol: "MON", cgId: "monad", logo: "https://cryptologos.cc/logos/monad-mon-logo.png" },
};

// Array of supported chain IDs
export const SUPPORTED_CHAINS = Object.keys(NETWORKS).map(id => Number(id));

// Helper to get chain metadata by ID
export const getNetworkMeta = (chainId) => NETWORKS[chainId] || { name: "Unknown", symbol: "NATIVE", cgId: "ethereum", logo: NETWORKS[1].logo };