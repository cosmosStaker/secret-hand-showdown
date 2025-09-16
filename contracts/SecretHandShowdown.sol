// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract SecretHandShowdown is SepoliaConfig {
    using FHE for *;
    
    struct Game {
        euint32 gameId;
        euint32 player1Score;
        euint32 player2Score;
        euint32 currentRound;
        euint32 totalRounds;
        bool isActive;
        bool isFinished;
        address player1;
        address player2;
        uint256 startTime;
        uint256 endTime;
    }
    
    struct Card {
        euint8 cardId;
        euint8 suit; // 0: Hearts, 1: Diamonds, 2: Clubs, 3: Spades
        euint8 value; // 1-13 (Ace to King)
        bool isPlayed;
    }
    
    struct PlayerHand {
        euint8[5] cards; // Encrypted card IDs
        euint8 cardsPlayed;
        address player;
    }
    
    struct Round {
        euint32 roundId;
        euint8 player1Card;
        euint8 player2Card;
        euint8 winner; // 0: tie, 1: player1, 2: player2
        bool isCompleted;
        uint256 timestamp;
    }
    
    mapping(uint256 => Game) public games;
    mapping(uint256 => PlayerHand) public playerHands;
    mapping(uint256 => Round) public rounds;
    mapping(address => euint32) public playerStats;
    mapping(address => euint32) public playerWins;
    mapping(address => euint32) public playerLosses;
    
    uint256 public gameCounter;
    uint256 public roundCounter;
    
    address public owner;
    address public verifier;
    
    event GameCreated(uint256 indexed gameId, address indexed player1, address indexed player2);
    event CardPlayed(uint256 indexed gameId, uint256 indexed roundId, address indexed player, uint8 cardId);
    event RoundCompleted(uint256 indexed gameId, uint256 indexed roundId, uint8 winner);
    event GameFinished(uint256 indexed gameId, address indexed winner);
    event PlayerStatsUpdated(address indexed player, uint32 wins, uint32 losses);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function createGame(
        address _player2,
        uint256 _duration
    ) public returns (uint256) {
        require(_player2 != address(0), "Invalid player2 address");
        require(_player2 != msg.sender, "Cannot play against yourself");
        require(_duration > 0, "Duration must be positive");
        
        uint256 gameId = gameCounter++;
        
        games[gameId] = Game({
            gameId: FHE.asEuint32(0), // Will be set properly later
            player1Score: FHE.asEuint32(0),
            player2Score: FHE.asEuint32(0),
            currentRound: FHE.asEuint32(0),
            totalRounds: FHE.asEuint32(5), // 5 rounds per game
            isActive: true,
            isFinished: false,
            player1: msg.sender,
            player2: _player2,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration
        });
        
        // Initialize player hands with encrypted card data
        _initializePlayerHand(gameId, msg.sender, true);
        _initializePlayerHand(gameId, _player2, false);
        
        emit GameCreated(gameId, msg.sender, _player2);
        return gameId;
    }
    
    function _initializePlayerHand(uint256 gameId, address player, bool isPlayer1) internal {
        uint256 handId = gameId * 2 + (isPlayer1 ? 0 : 1);
        
        // Initialize with encrypted card IDs (1-52)
        euint8[5] memory cards;
        for (uint8 i = 0; i < 5; i++) {
            cards[i] = FHE.asEuint8(i + 1); // Placeholder - in real implementation, these would be shuffled
        }
        
        playerHands[handId] = PlayerHand({
            cards: cards,
            cardsPlayed: FHE.asEuint8(0),
            player: player
        });
    }
    
    function playCard(
        uint256 gameId,
        externalEuint8 cardId,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(games[gameId].isActive, "Game is not active");
        require(block.timestamp <= games[gameId].endTime, "Game has ended");
        require(
            msg.sender == games[gameId].player1 || msg.sender == games[gameId].player2,
            "Not a player in this game"
        );
        
        // Convert externalEuint8 to euint8 using FHE.fromExternal
        euint8 internalCardId = FHE.fromExternal(cardId, inputProof);
        
        uint256 roundId = roundCounter++;
        
        // Determine which player is playing
        bool isPlayer1 = msg.sender == games[gameId].player1;
        uint256 handId = gameId * 2 + (isPlayer1 ? 0 : 1);
        
        // Validate card is in player's hand and not already played
        // This would require more complex FHE operations in a real implementation
        
        // Create new round
        rounds[roundId] = Round({
            roundId: FHE.asEuint32(0), // Will be set properly later
            player1Card: isPlayer1 ? internalCardId : FHE.asEuint8(0),
            player2Card: !isPlayer1 ? internalCardId : FHE.asEuint8(0),
            winner: FHE.asEuint8(0), // Will be determined after both players play
            isCompleted: false,
            timestamp: block.timestamp
        });
        
        // Update player hand
        playerHands[handId].cardsPlayed = FHE.add(playerHands[handId].cardsPlayed, FHE.asEuint8(1));
        
        emit CardPlayed(gameId, roundId, msg.sender, 0); // Card ID will be decrypted off-chain
        
        return roundId;
    }
    
    function completeRound(
        uint256 gameId,
        uint256 roundId,
        externalEuint8 player1Card,
        externalEuint8 player2Card,
        bytes calldata inputProof
    ) public {
        require(msg.sender == verifier, "Only verifier can complete rounds");
        require(games[gameId].isActive, "Game is not active");
        require(!rounds[roundId].isCompleted, "Round already completed");
        
        // Convert external values to internal FHE values
        euint8 internalPlayer1Card = FHE.fromExternal(player1Card, inputProof);
        euint8 internalPlayer2Card = FHE.fromExternal(player2Card, inputProof);
        
        // Update round with both cards
        rounds[roundId].player1Card = internalPlayer1Card;
        rounds[roundId].player2Card = internalPlayer2Card;
        
        // Determine winner using FHE operations
        // This is a simplified comparison - in reality, you'd need to decrypt card values
        // and compare them, then re-encrypt the result
        euint8 winner = FHE.asEuint8(0); // Placeholder for tie
        
        // Update game scores
        ebool player1Wins = FHE.eq(winner, FHE.asEuint8(1));
        ebool player2Wins = FHE.eq(winner, FHE.asEuint8(2));
        
        games[gameId].player1Score = FHE.select(
            player1Wins,
            FHE.add(games[gameId].player1Score, FHE.asEuint32(1)),
            games[gameId].player1Score
        );
        
        games[gameId].player2Score = FHE.select(
            player2Wins,
            FHE.add(games[gameId].player2Score, FHE.asEuint32(1)),
            games[gameId].player2Score
        );
        
        // Update current round
        games[gameId].currentRound = FHE.add(games[gameId].currentRound, FHE.asEuint32(1));
        
        // Mark round as completed
        rounds[roundId].isCompleted = true;
        rounds[roundId].winner = winner;
        
        emit RoundCompleted(gameId, roundId, 0); // Winner will be decrypted off-chain
        
        // Check if game is finished
        _checkGameCompletion(gameId);
    }
    
    function _checkGameCompletion(uint256 gameId) internal {
        // Check if all rounds are completed
        ebool allRoundsCompleted = FHE.eq(
            games[gameId].currentRound,
            games[gameId].totalRounds
        );
        
        if (FHE.decrypt(allRoundsCompleted)) {
            games[gameId].isActive = false;
            games[gameId].isFinished = true;
            
            // Determine winner
            ebool player1Wins = FHE.gt(games[gameId].player1Score, games[gameId].player2Score);
            ebool player2Wins = FHE.gt(games[gameId].player2Score, games[gameId].player1Score);
            
            address winner = FHE.decrypt(player1Wins) ? games[gameId].player1 : 
                           FHE.decrypt(player2Wins) ? games[gameId].player2 : address(0);
            
            if (winner != address(0)) {
                // Update player statistics
                playerWins[winner] = FHE.add(playerWins[winner], FHE.asEuint32(1));
                
                address loser = winner == games[gameId].player1 ? games[gameId].player2 : games[gameId].player1;
                playerLosses[loser] = FHE.add(playerLosses[loser], FHE.asEuint32(1));
                
                emit PlayerStatsUpdated(winner, 0, 0); // Values will be decrypted off-chain
                emit PlayerStatsUpdated(loser, 0, 0); // Values will be decrypted off-chain
            }
            
            emit GameFinished(gameId, winner);
        }
    }
    
    function getGameInfo(uint256 gameId) public view returns (
        address player1,
        address player2,
        uint8 player1Score,
        uint8 player2Score,
        uint8 currentRound,
        uint8 totalRounds,
        bool isActive,
        bool isFinished,
        uint256 startTime,
        uint256 endTime
    ) {
        Game storage game = games[gameId];
        return (
            game.player1,
            game.player2,
            0, // FHE.decrypt(game.player1Score) - will be decrypted off-chain
            0, // FHE.decrypt(game.player2Score) - will be decrypted off-chain
            0, // FHE.decrypt(game.currentRound) - will be decrypted off-chain
            0, // FHE.decrypt(game.totalRounds) - will be decrypted off-chain
            game.isActive,
            game.isFinished,
            game.startTime,
            game.endTime
        );
    }
    
    function getPlayerHand(uint256 gameId, bool isPlayer1) public view returns (
        uint8[5] memory cards,
        uint8 cardsPlayed,
        address player
    ) {
        uint256 handId = gameId * 2 + (isPlayer1 ? 0 : 1);
        PlayerHand storage hand = playerHands[handId];
        
        // In a real implementation, you'd need to decrypt the cards
        uint8[5] memory decryptedCards;
        for (uint8 i = 0; i < 5; i++) {
            decryptedCards[i] = 0; // FHE.decrypt(hand.cards[i]) - will be decrypted off-chain
        }
        
        return (
            decryptedCards,
            0, // FHE.decrypt(hand.cardsPlayed) - will be decrypted off-chain
            hand.player
        );
    }
    
    function getRoundInfo(uint256 roundId) public view returns (
        uint8 player1Card,
        uint8 player2Card,
        uint8 winner,
        bool isCompleted,
        uint256 timestamp
    ) {
        Round storage round = rounds[roundId];
        return (
            0, // FHE.decrypt(round.player1Card) - will be decrypted off-chain
            0, // FHE.decrypt(round.player2Card) - will be decrypted off-chain
            0, // FHE.decrypt(round.winner) - will be decrypted off-chain
            round.isCompleted,
            round.timestamp
        );
    }
    
    function getPlayerStats(address player) public view returns (
        uint8 wins,
        uint8 losses
    ) {
        return (
            0, // FHE.decrypt(playerWins[player]) - will be decrypted off-chain
            0  // FHE.decrypt(playerLosses[player]) - will be decrypted off-chain
        );
    }
    
    function updateVerifier(address _verifier) public {
        require(msg.sender == owner, "Only owner can update verifier");
        require(_verifier != address(0), "Invalid verifier address");
        verifier = _verifier;
    }
    
    function emergencyPause(uint256 gameId) public {
        require(msg.sender == owner || msg.sender == verifier, "Not authorized");
        require(games[gameId].isActive, "Game is not active");
        games[gameId].isActive = false;
    }
    
    function emergencyResume(uint256 gameId) public {
        require(msg.sender == owner, "Only owner can resume");
        require(!games[gameId].isFinished, "Game is finished");
        games[gameId].isActive = true;
    }
}
