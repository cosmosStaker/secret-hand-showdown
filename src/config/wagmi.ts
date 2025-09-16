import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { QueryClient } from '@tanstack/react-query';
import { tempConfig } from './temp-env';

// Use temporary config for testing (replace with environment variables in production)
const projectId = tempConfig.walletConnectProjectId;
const rpcUrl = tempConfig.rpcUrl;
const chainId = tempConfig.chainId;

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
