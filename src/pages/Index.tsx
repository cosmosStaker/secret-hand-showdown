import { useState } from "react";
import { WalletConnector } from "@/components/WalletConnector";
import { GameBoard } from "@/components/GameBoard";
import { GameLogo } from "@/components/GameLogo";
import { Card } from "@/components/ui/card";
import { Lock, Cpu, Layers } from "lucide-react";

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mystical opacity-10" />
        <div className="relative container mx-auto px-4 py-12 text-center">
          <div className="space-y-6">
            <div className="flex justify-center">
              <GameLogo size="lg" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                Play Cards Without
                <span className="block bg-gradient-gold bg-clip-text text-transparent">
                  Revealing Hands
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the ultimate card game where your deck remains encrypted until the moment you play. 
                Strategic gameplay meets cryptographic security.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <span>Encrypted Decks</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-accent" />
                <span>Instant Gameplay</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-mystical-gold" />
                <span>Fair Competition</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        {!isWalletConnected ? (
          <div className="max-w-md mx-auto">
            <WalletConnector onConnectionChange={setIsWalletConnected} />
          </div>
        ) : (
          <GameBoard isWalletConnected={isWalletConnected} />
        )}
      </main>
    </div>
  );
};

export default Index;
