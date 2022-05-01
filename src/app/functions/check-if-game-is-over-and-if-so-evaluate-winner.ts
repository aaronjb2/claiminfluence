import {SquarekleGame} from '../squarekles-game/interfaces/squarekle-game';
import {getPlayerPoints} from './get-player-points';
import {getIntegerRepresentingPlayerCardOwnershipLocation} from './get-integer-representing-player-card-ownership-location';
import {getIntegerRepresentingPlayerBonusTileOwnershipLocation} from './get-integer-representing-player-bonus-tile-ownership-location';
import {playerMeetsAllWinningConditions} from './player-meets-all-winning-conditions';

export function checkIfGameIsOverAndIfSoEvaluateWinner(game: SquarekleGame): number[] {
  const playersMeetingAllWinningConditions = [];
  for (let i = 0; i < game.players.length; i++) {
    if (playerMeetsAllWinningConditions(i, game)) {
      playersMeetingAllWinningConditions.push(i);
    }
  }
  if (playersMeetingAllWinningConditions.length === 0) {
    return [];
  }
  if (game.turn < game.players.length - 1 && game.started) {
    return [];
  }
  let maxPoints = getPlayerPoints(playersMeetingAllWinningConditions[0], game.cards, game.bonusTiles);
  for (let i = 0; i < playersMeetingAllWinningConditions.length; i++) {
    const points = getPlayerPoints(playersMeetingAllWinningConditions[i], game.cards, game.bonusTiles);
    if (points > maxPoints) {
      maxPoints = points;
    }
  }
  const playersWithMaxPoints = [];
  for (let i = 0; i < playersMeetingAllWinningConditions.length; i++) {
    const points = getPlayerPoints(playersMeetingAllWinningConditions[i], game.cards, game.bonusTiles);
    if (points === maxPoints) {
      playersWithMaxPoints.push(playersMeetingAllWinningConditions[i]);
    }
  }
  if (playersWithMaxPoints.length === 1) {
    return playersWithMaxPoints;
  }
  const playersWithBonusTile = [];
  for (let i = 0; i < playersWithMaxPoints.length; i++) {
    if (playerHasHashtagTile(playersWithMaxPoints[i], game)) {
      playersWithBonusTile.push(playersWithMaxPoints[i]);
    }
  }
  if (playersWithBonusTile.length === 1) {
    return playersWithBonusTile;
  }
  let lowestNumberOfCardsHeld = getTotalPlayerCards(playersWithMaxPoints[0], game);
  for (let i = 0; i < playersWithMaxPoints.length; i++) {
    const cardQuantity = getTotalPlayerCards(playersWithMaxPoints[i], game);
    if (lowestNumberOfCardsHeld > cardQuantity) {
      lowestNumberOfCardsHeld = cardQuantity;
    }
  }
  const playersWithMaxPointsAndLeastCards = [];
  for (let i = 0; i < playersWithMaxPoints.length; i++) {
    if (getTotalPlayerCards(playersWithMaxPoints[i], game) === lowestNumberOfCardsHeld) {
      playersWithMaxPointsAndLeastCards.push(playersWithMaxPoints[i]);
    }
  }
  return playersWithMaxPointsAndLeastCards;
}

function playerHasHashtagTile(playerIndex: number, game: SquarekleGame): boolean {
  const playerBonusNum = getIntegerRepresentingPlayerBonusTileOwnershipLocation(playerIndex);
  return game.bonusTiles.filter(tile => tile.cost.length === 0 && tile.bonusLocation === playerBonusNum).length > 0;
}

function getTotalPlayerCards(playerIndex: number, game: SquarekleGame): number {
  const playerOwnershipNum = getIntegerRepresentingPlayerCardOwnershipLocation(playerIndex);
  return game.cards.filter(card => card.cardLocation === playerOwnershipNum).length;
}
