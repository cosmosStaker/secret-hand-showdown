import { cn } from "@/lib/utils";
import logoImage from "@/assets/game-logo.jpg";

interface GameLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const GameLogo = ({ className, size = "md" }: GameLogoProps) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20", 
    lg: "w-32 h-32"
  };

  return (
    <div className={cn(
      "relative rounded-full overflow-hidden bg-gradient-mystical shadow-glow animate-float",
      sizeClasses[size],
      className
    )}>
      <img 
        src={logoImage} 
        alt="Encrypted Cards Game Logo" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-mystical/20 rounded-full" />
    </div>
  );
};