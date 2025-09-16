import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { config } from './env';

export const wagmiConfig = getDefaultConfig({
  appName: 'Secret Hand Showdown',
  projectId: config.walletConnectProjectId,
  chains: [sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
