import { Alchemy, Network } from "alchemy-sdk";

const ALCHEMY_NETWORKS = {
  1: Network.ETH_MAINNET,
  137: Network.MATIC_MAINNET,
  42161: Network.ARB_MAINNET,
  10: Network.OPT_MAINNET,
  8453: Network.BASE_MAINNET,
};

// Create an Alchemy instance based on the chainId
export const getAlchemy = (chainId) => {
  const network = ALCHEMY_NETWORKS[chainId] || Network.ETH_MAINNET;

  return new Alchemy({
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
    network,
  });
};