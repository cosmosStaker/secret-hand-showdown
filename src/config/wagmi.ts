import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { QueryClient } from '@tanstack/react-query';

// Use environment variables with fallbacks
const projectId = import.meta.env.VITE_NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_WALLET_CONNECT_PROJECT_ID';
const rpcUrl = import.meta.env.VITE_NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY';
const chainId = Number(import.meta.env.VITE_NEXT_PUBLIC_CHAIN_ID || '11155111');

const chains = [
  {
    ...sepolia,
    id: chainId,
    rpcUrls: {
      default: { http: [rpcUrl] },
    },
  },
];

export const wagmiConfig = getDefaultConfig({
  appName: 'Secret Hand Showdown',
  projectId,
  chains: chains as any, // Cast to any to bypass potential type issues with custom chain config
  ssr: false, // If your dApp uses server side rendering (SSR)
});

export const queryClient = new QueryClient();
