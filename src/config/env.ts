// Environment configuration for Secret Hand Showdown
export const config = {
  // Chain Configuration
  chainId: 11155111, // Sepolia testnet
  rpcUrl: import.meta.env.VITE_NEXT_PUBLIC_RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY",
  
  // Wallet Connect Configuration
  walletConnectProjectId: import.meta.env.VITE_NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "YOUR_WALLET_CONNECT_PROJECT_ID",
  
  // Infura Configuration
  infuraApiKey: import.meta.env.VITE_NEXT_PUBLIC_INFURA_API_KEY || "YOUR_INFURA_API_KEY",
  alternativeRpcUrl: "https://1rpc.io/sepolia",
  
  // Contract addresses (to be deployed)
  gameContractAddress: "", // Will be set after deployment
  fheContractAddress: "", // Will be set after deployment
} as const;
