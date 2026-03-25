import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, bsc, arbitrum, optimism, base } from 'wagmi/chains';
import { http } from 'wagmi';

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

// ✅ Custom Monad chain (clean + safe)
const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
};

// ✅ Centralized chain RPC config (VERY IMPORTANT for scaling)
export const RPC_URLS = {
  [mainnet.id]: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [polygon.id]: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [arbitrum.id]: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [optimism.id]: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [base.id]: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  [bsc.id]: 'https://bsc-dataseed.binance.org', // ✅ fixed
  [monadTestnet.id]: 'https://testnet-rpc.monad.xyz',
};

// ✅ Wagmi + RainbowKit config
export const config = getDefaultConfig({
  appName: 'NovaTrack',
  projectId: import.meta.env.VITE_WC_PROJECT_ID,

  chains: [
    mainnet,
    polygon,
    bsc,
    arbitrum,
    optimism,
    base,
    monadTestnet,
  ],

  transports: {
    [mainnet.id]: http(RPC_URLS[mainnet.id]),
    [polygon.id]: http(RPC_URLS[polygon.id]),
    [arbitrum.id]: http(RPC_URLS[arbitrum.id]),
    [optimism.id]: http(RPC_URLS[optimism.id]),
    [base.id]: http(RPC_URLS[base.id]),
    [bsc.id]: http(RPC_URLS[bsc.id]),
    [monadTestnet.id]: http(RPC_URLS[monadTestnet.id]),
  },
});