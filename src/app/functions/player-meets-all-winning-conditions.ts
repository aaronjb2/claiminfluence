import {SquarekleGame} from '../squarekles-game/interfaces/squarekle-game';
import {getPlayerPoints} from './get-player-points';
import {getIntegerRepresentingPlayerCardOwnershipLocation} from './get-integer-representing-player-card-ownership-location';
import {Tiers} from '../squarekles-game/enums/tiers';

export function playerMeetsAllWinningConditions(playerIndex: number, game: SquarekleGame): boolean {
  const pointsRequired = game.hashtagMode ? 16 : 15;
  const playerPoints = getPlayerPoints(playerIndex, game.cards, game.bonusTiles);
  const disqualifiedByLackOfTopTierCard = game.mustBuyTopTierSquareToWin && game.cards.filter(card => {
    const playerOwnershipNum = getIntegerRepresentingPlayerCardOwnershipLocation(playerIndex);
    return card.cardLocation === playerOwnershipNum && card.tier === Tiers.Top;
  }).length === 0;
  if (disqualifiedByLackOfTopTierCard) {
    return false;
  }
  const disqualifiedByNotHavingEachColor = game.mustHaveOneSquareOfEachColorToWin && !playerHasOneOfEachColor(playerIndex, game);
  if (disqualifiedByNotHavingEachColor) {
    return false;
  }
  if (playerPoints < pointsRequired) {
    return false;
  }
  return true;
}

function playerHasOneOfEachColor(playerIndex: number, game: SquarekleGame): boolean {
  const playerOwnerShipNum = getIntegerRepresentingPlayerCardOwnershipLocation(playerIndex);
  const playerHasColor0 = game.cards.filter(card => card.color === 0 && card.cardLocation === playerOwnerShipNum).length > 0;
  const playerHasColor1 = game.cards.filter(card => card.color === 1 && card.cardLocation === playerOwnerShipNum).length > 0;
  const playerHasColor2 = game.cards.filter(card => card.color === 2 && card.cardLocation === playerOwnerShipNum).length > 0;
  const playerHasColor3 = game.cards.filter(card => card.color === 3 && card.cardLocation === playerOwnerShipNum).length > 0;
  const playerHasColor4 = game.cards.filter(card => card.color === 4 && card.cardLocation === playerOwnerShipNum).length > 0;
  return playerHasColor0 && playerHasColor1 && playerHasColor2 && playerHasColor3 && playerHasColor4;
}
