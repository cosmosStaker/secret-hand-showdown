import { useState } from "react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  id: string;
  name?: string;
  cost?: number;
  power?: number;
  toughness?: number;
  isRevealed?: boolean;
  isPlayable?: boolean;
  onClick?: () => void;
  className?: string;
}

export const GameCard = ({
  id,
  name = "Hidden Card",
  cost = 0,
  power = 1,
  toughness = 1,
  isRevealed = false,
  isPlayable = true,
  onClick,
  className,
}: GameCardProps) => {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleClick = () => {
    if (!isPlayable || isFlipping) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipping(false);
      onClick?.();
    }, 300);
  };

  return (
    <div
      className={cn(
        "relative w-24 h-36 md:w-32 md:h-48 cursor-pointer transition-all duration-300",
        "hover:scale-105 hover:shadow-card-hover",
        isPlayable && "hover:shadow-glow",
        !isPlayable && "opacity-50 cursor-not-allowed",
        isFlipping && "animate-card-flip",
        className
      )}
      onClick={handleClick}
    >
      {/* Card Back - Hidden State */}
      {!isRevealed && (
        <div className="absolute inset-0 bg-gradient-mystical rounded-lg border border-primary/30 shadow-card">
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 md:w-6 md:h-6 bg-gradient-gold rounded-full animate-mystical-glow" />
            </div>
          </div>
          
          {/* Mystical border pattern */}
          <div className="absolute inset-2 border border-accent/20 rounded-md" />
          <div className="absolute inset-4 border border-primary/20 rounded-sm" />
        </div>
      )}

      {/* Card Front - Revealed State */}
      {isRevealed && (
        <div className="absolute inset-0 bg-gradient-card rounded-lg border border-accent/40 shadow-card-hover">
          <div className="p-2 md:p-3 h-full flex flex-col">
            {/* Mana Cost */}
            <div className="flex justify-end mb-1">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-gold rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-accent-foreground">
                {cost}
              </div>
            </div>
            
            {/* Card Name */}
            <div className="text-xs md:text-sm font-semibold text-card-foreground mb-2 text-center">
              {name}
            </div>
            
            {/* Card Art Area */}
            <div className="flex-1 bg-muted/20 rounded border border-border/30 mb-2 flex items-center justify-center">
              <div className="text-xs text-muted-foreground">Art</div>
            </div>
            
            {/* Power/Toughness */}
            <div className="flex justify-end">
              <div className="bg-destructive/80 rounded px-1.5 py-0.5 text-xs md:text-sm font-bold text-destructive-foreground">
                {power}/{toughness}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Glow effect for playable cards */}
      {isPlayable && !isRevealed && (
        <div className="absolute inset-0 rounded-lg bg-primary/10 animate-pulse opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
    </div>
  );
};