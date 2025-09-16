import { useState, useEffect } from "react";
import { GameCard } from "./GameCard";
import { GamePhases, GamePhase } from "./GamePhases";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shuffle, Eye, EyeOff, Heart, Sword } from "lucide-react";
import { toast } from "sonner";

interface GameBoardProps {
  isWalletConnected: boolean;
}

export const GameBoard = ({ isWalletConnected }: GameBoardProps) => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('waiting');
  const [playerTurn, setPlayerTurn] = useState(true);
  const [playerHealth, setPlayerHealth] = useState(20);
  const [opponentHealth, setOpponentHealth] = useState(20);
  const [playerMana, setPlayerMana] = useState(1);
  const [maxPlayerMana, setMaxPlayerMana] = useState(1);
  const [turnNumber, setTurnNumber] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes per turn
  
  const [playerHand, setPlayerHand] = useState(
    Array.from({ length: 7 }, (_, i) => ({
      id: `player-${i}`,
      isRevealed: false,
      isPlayable: true,
    }))
  );
  
  const [opponentHand, setOpponentHand] = useState(
    Array.from({ length: 7 }, (_, i) => ({
      id: `opponent-${i}`,
      isRevealed: false,
      isPlayable: false,
    }))
  );

  const [battlefield, setBattlefield] = useState<Array<{
    id: string;
    name: string;
    cost: number;
    power: number;
    toughness: number;
    owner: 'player' | 'opponent';
  }>>([]);

  const [showHand, setShowHand] = useState(false);

  // Game initialization effect
  useEffect(() => {
    if (isWalletConnected && gamePhase === 'waiting') {
      toast.info("Initializing game...");
      setTimeout(() => {
        setGamePhase('shuffling');
        setTimeout(() => {
          setGamePhase('drawing');
          setTimeout(() => {
            setGamePhase('playing');
            toast.success("Game started! Your turn.");
          }, 1500);
        }, 2000);
      }, 1000);
    }
  }, [isWalletConnected, gamePhase]);

  // Turn timer effect
  useEffect(() => {
    if (gamePhase === 'playing' || gamePhase === 'combat') {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endTurn();
            return 180;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gamePhase, playerTurn]);

  const endTurn = () => {
    setPlayerTurn(!playerTurn);
    setTurnNumber(prev => prev + 1);
    setTimeRemaining(180);
    
    if (playerTurn) {
      // Player's turn ended, opponent's turn starts
      setMaxPlayerMana(prev => Math.min(prev + 1, 10));
      setPlayerMana(maxPlayerMana + 1);
      toast.info("Opponent's turn");
    } else {
      // Opponent's turn ended, player's turn starts
      toast.info("Your turn");
    }
  };

  const playCard = (cardId: string) => {
    if (!isWalletConnected) {
      toast.error("Connect your wallet first!");
      return;
    }

    if (gamePhase !== 'playing') {
      toast.error("Can only play cards during main phase!");
      return;
    }

    if (!playerTurn) {
      toast.error("Wait for your turn!");
      return;
    }

    const cardIndex = playerHand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return;

    const cardCost = Math.floor(Math.random() * 6) + 1;
    
    if (playerMana < cardCost) {
      toast.error(`Not enough mana! Need ${cardCost}, have ${playerMana}`);
      return;
    }

    const newCard = {
      id: cardId,
      name: `Creature ${Math.floor(Math.random() * 100)}`,
      cost: cardCost,
      power: Math.floor(Math.random() * 5) + 1,
      toughness: Math.floor(Math.random() * 5) + 1,
      owner: 'player' as const,
    };

    setBattlefield(prev => [...prev, newCard]);
    setPlayerHand(prev => prev.filter(card => card.id !== cardId));
    setPlayerMana(prev => prev - cardCost);
    
    toast.success(`Played ${newCard.name} for ${cardCost} mana!`);
  };

  const shuffleDeck = () => {
    if (!isWalletConnected) {
      toast.error("Connect your wallet first!");
      return;
    }
    
    toast.success("Deck shuffled with cryptographic security!");
  };

  const toggleHandVisibility = () => {
    setShowHand(!showHand);
    const newPlayerHand = playerHand.map(card => ({
      ...card,
      isRevealed: !showHand,
    }));
    setPlayerHand(newPlayerHand);
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4 space-y-4">
      {/* Game Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Player Stats */}
        <Card className="p-4 bg-gradient-card border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-destructive" />
              <span className="text-lg font-bold">{playerHealth}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">Mana:</div>
              <div className="flex gap-1">
                {Array.from({ length: maxPlayerMana }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < playerMana ? 'bg-accent' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">You</div>
        </Card>

        {/* Game Phase */}
        <GamePhases 
          currentPhase={gamePhase}
          onPhaseChange={setGamePhase}
          playerTurn={playerTurn}
          timeRemaining={timeRemaining}
        />

        {/* Opponent Stats */}
        <Card className="p-4 bg-gradient-card border-destructive/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-destructive" />
              <span className="text-lg font-bold">{opponentHealth}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sword className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Opponent</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Turn {turnNumber}</div>
        </Card>
      </div>
      {/* Opponent Area */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground text-center">
          Opponent's Hand (Encrypted)
        </h3>
        <div className="flex justify-center gap-1 md:gap-2">
          {opponentHand.map((card) => (
            <GameCard
              key={card.id}
              id={card.id}
              isRevealed={card.isRevealed}
              isPlayable={card.isPlayable}
              className="scale-75 md:scale-100"
            />
          ))}
        </div>
      </div>

      {/* Battlefield */}
      <Card className="p-6 bg-gradient-card border-border/30 min-h-[200px]">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 text-center">
          Battlefield
        </h3>
        {battlefield.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No creatures in play</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-items-center">
            {battlefield.map((card) => (
              <GameCard
                key={card.id}
                id={card.id}
                name={card.name}
                cost={card.cost}
                power={card.power}
                toughness={card.toughness}
                isRevealed={true}
                isPlayable={false}
                className={card.owner === 'player' ? 'border-primary/50' : 'border-destructive/50'}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Player Controls */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={shuffleDeck}
          disabled={!isWalletConnected}
          variant="outline"
          className="border-accent/30 hover:bg-accent/10"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Shuffle Deck
        </Button>
        
        <Button
          onClick={toggleHandVisibility}
          disabled={!isWalletConnected}
          variant="outline"
          className="border-primary/30 hover:bg-primary/10"
        >
          {showHand ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Hide Hand
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Reveal Hand
            </>
          )}
        </Button>
      </div>

      {/* Player Hand */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground text-center">
          Your Hand {!isWalletConnected && "(Connect wallet to play)"}
        </h3>
        <div className="flex justify-center gap-1 md:gap-2">
          {playerHand.map((card) => (
            <GameCard
              key={card.id}
              id={card.id}
              name={showHand ? `Card ${card.id.split('-')[1]}` : undefined}
              cost={showHand ? Math.floor(Math.random() * 6) + 1 : undefined}
              power={showHand ? Math.floor(Math.random() * 4) + 1 : undefined}
              toughness={showHand ? Math.floor(Math.random() * 4) + 1 : undefined}
              isRevealed={card.isRevealed}
              isPlayable={card.isPlayable && isWalletConnected}
              onClick={() => playCard(card.id)}
              className="scale-90 md:scale-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
};