import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, Lock, Cpu } from "lucide-react";
import { toast } from "sonner";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';

interface WalletConnectorProps {
  onConnectionChange?: (connected: boolean) => void;
}

export const WalletConnector = ({ onConnectionChange }: WalletConnectorProps) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleConnectionChange = (connected: boolean) => {
    onConnectionChange?.(connected);
    if (connected) {
      toast.success("Wallet connected and deck encrypted!");
    } else {
      toast.info("Wallet disconnected");
    }
  };

  if (isConnected && address) {
    return (
      <Card className="p-4 bg-gradient-card border-accent/30 shadow-glow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-mystical rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-card-foreground">Connected</p>
              <p className="text-xs text-muted-foreground font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              disconnect();
              handleConnectionChange(false);
            }}
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            Disconnect
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border-primary/30 shadow-card">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-mystical rounded-full flex items-center justify-center animate-mystical-glow">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-card-foreground">
            Secure Your Deck
          </h3>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to encrypt your deck and join the battle
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            <span>Instant</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Encrypted</span>
          </div>
        </div>
        
        <div className="w-full">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <Button
                          onClick={openConnectModal}
                          className="w-full bg-gradient-mystical hover:shadow-glow transition-all duration-300"
                        >
                          <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            Connect Wallet
                          </div>
                        </Button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <Button
                          onClick={openChainModal}
                          className="w-full bg-destructive hover:bg-destructive/90"
                        >
                          Wrong network
                        </Button>
                      );
                    }

                    return (
                      <div className="flex gap-2">
                        <Button
                          onClick={openChainModal}
                          className="flex items-center gap-2"
                          variant="outline"
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 12,
                                height: 12,
                                borderRadius: 999,
                                overflow: 'hidden',
                                marginRight: 4,
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  style={{ width: 12, height: 12 }}
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </Button>

                        <Button
                          onClick={openAccountModal}
                          className="flex items-center gap-2"
                          variant="outline"
                        >
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ''}
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </Card>
  );
};