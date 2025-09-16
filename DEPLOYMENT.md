# Vercel Deployment Guide for Secret Hand Showdown

This guide provides step-by-step instructions for deploying the Secret Hand Showdown application to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Node.js 18+ installed locally (for testing)

## Step-by-Step Deployment

### 1. Fork the Repository

1. Go to [https://github.com/cosmosStaker/secret-hand-showdown](https://github.com/cosmosStaker/secret-hand-showdown)
2. Click the "Fork" button in the top-right corner
3. Select your GitHub account as the destination
4. Wait for the fork to complete

### 2. Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Sign Up" or "Log In"
3. Choose "Continue with GitHub" to link your accounts
4. Authorize Vercel to access your GitHub repositories

### 3. Import Project to Vercel

1. In your Vercel dashboard, click "New Project"
2. Find and select your forked `secret-hand-showdown` repository
3. Click "Import"

### 4. Configure Project Settings

#### Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Environment Variables
Add the following environment variables in Vercel:

```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_API_KEY
```

**Note**: Replace the placeholder values with your actual API keys:
- Get Infura API key from [infura.io](https://infura.io)
- Get WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com)

**To add environment variables:**
1. In the project settings, go to "Environment Variables"
2. Click "Add New"
3. Add each variable with its value
4. Make sure to select "Production", "Preview", and "Development" for each variable

### 5. Deploy

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-3 minutes)
3. Once deployed, you'll get a live URL (e.g., `https://your-project-name.vercel.app`)

### 6. Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" → "Domains"
2. Click "Add Domain"
3. Enter your custom domain name
4. Follow the DNS configuration instructions
5. Wait for DNS propagation (can take up to 24 hours)

## Post-Deployment Configuration

### 1. Test the Application

1. Visit your deployed URL
2. Connect a Web3 wallet (MetaMask, Rainbow, etc.)
3. Ensure you're on Sepolia testnet
4. Test wallet connection functionality

### 2. Smart Contract Deployment

The smart contract needs to be deployed separately to Sepolia testnet:

```bash
# Install Hardhat (if not already installed)
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers

# Deploy to Sepolia (requires Sepolia ETH for gas)
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Update Contract Address

After deploying the smart contract:

1. Update the contract address in `src/config/env.ts`
2. Redeploy to Vercel (automatic if connected to GitHub)

## Troubleshooting

### Common Issues

#### Build Failures
- **Error**: "Module not found"
  - **Solution**: Ensure all dependencies are in `package.json`

- **Error**: "TypeScript errors"
  - **Solution**: Fix TypeScript errors locally first

#### Runtime Issues
- **Error**: "Wallet connection failed"
  - **Solution**: Check WalletConnect Project ID is correct

- **Error**: "Network not supported"
  - **Solution**: Ensure users are on Sepolia testnet

### Environment Variables Not Working

1. Double-check variable names (case-sensitive)
2. Ensure variables are added to all environments
3. Redeploy after adding new variables

### Performance Optimization

1. **Enable Vercel Analytics** (optional)
2. **Configure Edge Functions** for better performance
3. **Set up CDN** for static assets

## Monitoring and Maintenance

### 1. Vercel Analytics

1. Go to "Analytics" tab in your Vercel dashboard
2. Enable analytics to monitor performance
3. Set up alerts for errors

### 2. Automatic Deployments

- Every push to `main` branch triggers automatic deployment
- Preview deployments are created for pull requests
- Use branch protection rules for production deployments

### 3. Updates and Maintenance

1. Make changes in your forked repository
2. Push changes to trigger automatic deployment
3. Monitor deployment logs for any issues

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to GitHub
2. **API Keys**: Rotate keys regularly
3. **Access Control**: Limit repository access to trusted contributors
4. **HTTPS**: Vercel automatically provides SSL certificates

## Cost Considerations

- **Vercel Free Tier**: 100GB bandwidth, 100 serverless function executions
- **Upgrade**: Consider Pro plan for higher limits
- **Monitoring**: Keep track of usage in Vercel dashboard

## Support and Resources

- **Vercel Documentation**: [https://vercel.com/docs](https://vercel.com/docs)
- **GitHub Integration**: [https://vercel.com/docs/git/vercel-for-github](https://vercel.com/docs/git/vercel-for-github)
- **Environment Variables**: [https://vercel.com/docs/projects/environment-variables](https://vercel.com/docs/projects/environment-variables)

## Quick Reference

### Essential Commands
```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel (if using Vercel CLI)
vercel --prod
```

### Key URLs
- **Repository**: https://github.com/cosmosStaker/secret-hand-showdown
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Sepolia Faucet**: https://sepoliafaucet.com/

---

**Note**: This deployment guide assumes you have basic knowledge of Git, GitHub, and web development. If you encounter issues, refer to the troubleshooting section or consult the official documentation.
