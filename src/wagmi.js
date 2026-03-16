import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, bsc } from 'wagmi/chains';
import { http } from 'wagmi';

// Define Monad with a full rpcUrls object to prevent the 'undefined' crash
const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
};

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

export const config = getDefaultConfig({
  appName: 'NovaTrack',
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
  chains: [mainnet, polygon, bsc, monadTestnet], 
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`),
    [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`),
    [bsc.id]: http(), 
    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'),
  },
});