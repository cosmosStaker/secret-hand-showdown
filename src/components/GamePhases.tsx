import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play, Pause } from "lucide-react";

export type GamePhase = 'waiting' | 'shuffling' | 'drawing' | 'playing' | 'combat' | 'ended';

interface GamePhasesProps {
  currentPhase: GamePhase;
  onPhaseChange: (phase: GamePhase) => void;
  playerTurn: boolean;
  timeRemaining?: number;
}

const phaseConfig = {
  waiting: { label: "Waiting for Players", color: "secondary" },
  shuffling: { label: "Shuffling Decks", color: "default" },
  drawing: { label: "Drawing Cards", color: "outline" },
  playing: { label: "Main Phase", color: "default" },
  combat: { label: "Combat Phase", color: "destructive" },
  ended: { label: "Game Ended", color: "secondary" }
} as const;

export const GamePhases = ({ currentPhase, onPhaseChange, playerTurn, timeRemaining }: GamePhasesProps) => {
  const canProgress = playerTurn && (currentPhase === 'playing' || currentPhase === 'combat');
  
  const nextPhase = () => {
    if (currentPhase === 'playing') {
      onPhaseChange('combat');
    } else if (currentPhase === 'combat') {
      onPhaseChange('playing');
    }
  };

  return (
    <Card className="p-4 bg-gradient-card border-accent/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant={phaseConfig[currentPhase].color as any}>
            {phaseConfig[currentPhase].label}
          </Badge>
          
          {playerTurn && (
            <Badge variant="outline" className="border-primary/50 text-primary">
              Your Turn
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {timeRemaining && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
            </div>
          )}
          
          {canProgress && (
            <Button 
              size="sm" 
              onClick={nextPhase}
              className="bg-gradient-mystical hover:shadow-glow"
            >
              {currentPhase === 'playing' ? (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Combat
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 mr-1" />
                  End Turn
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};