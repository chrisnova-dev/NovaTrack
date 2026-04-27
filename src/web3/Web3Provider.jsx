import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { mainnet, polygon, bsc, arbitrum, optimism, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const projectId = import.meta.env.VITE_WC_PROJECT_ID;
const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;

//  Custom chain: Monad Testnet
const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
    public: { http: ["https://testnet-rpc.monad.xyz"] },
  },
};

//  Centralized RPCs for multi-chain scalability
export const RPC_URLS = {
  [mainnet.id]: `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`,
  [polygon.id]: `https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}`,
  [arbitrum.id]: `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}`,
  [optimism.id]: `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}`,
  [base.id]: `https://base-mainnet.g.alchemy.com/v2/${alchemyKey}`,
  [bsc.id]: "https://bsc-dataseed.binance.org",
  [monadTestnet.id]: "https://testnet-rpc.monad.xyz",
};

//  Wagmi + RainbowKit Config
const config = getDefaultConfig({
  appName: "NovaTrack",
  projectId,
  chains: [mainnet, polygon, bsc, arbitrum, optimism, base, monadTestnet],
  transports: Object.fromEntries(
    Object.entries(RPC_URLS).map(([chainId, url]) => [chainId, http(url)]),
  ),
});

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#00e5ff",
            accentColorForeground: "#000",
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
