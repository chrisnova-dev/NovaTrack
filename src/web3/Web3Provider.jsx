import React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import { mainnet, polygon, bsc } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const projectId = import.meta.env.VITE_WC_PROJECT_ID;
const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;

// Define Monad specifically to ensure it has a valid structure
const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
};

const config = getDefaultConfig({
  appName: 'NovaTrack',
  projectId: projectId,
  // Ensure every chain here has a matching line in transports below!
  chains: [mainnet, polygon, bsc, monadTestnet], 
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`),
    [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}`),
    [bsc.id]: http(), // Fixed: Added the missing transport for BSC
    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'), // Fixed: Added Monad transport
  },
});

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({ accentColor: '#6366f1' })} 
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;