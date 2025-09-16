// Temporary environment configuration for testing
// This file should be removed in production and replaced with proper environment variables

export const tempConfig = {
  // Chain Configuration
  chainId: 11155111, // Sepolia testnet
  rpcUrl: "https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990",
  
  // Wallet Connect Configuration
  walletConnectProjectId: "2ec9743d0d0cd7fb94dee1a7e6d33475",
  
  // Infura Configuration
  infuraApiKey: "b18fb7e6ca7045ac83c41157ab93f990",
  alternativeRpcUrl: "https://1rpc.io/sepolia",
  
  // Contract addresses (to be deployed)
  gameContractAddress: "", // Will be set after deployment
  fheContractAddress: "", // Will be set after deployment
} as const;
