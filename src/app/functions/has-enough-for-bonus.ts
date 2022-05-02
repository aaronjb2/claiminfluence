import {BonusTile} from '../squarekles-game/interfaces/bonus-tile';
import {Card} from '../squarekles-game/interfaces/card';
import {getIntegerRepresentingPlayerCardOwnershipLocation} from './get-integer-representing-player-card-ownership-location';

export function hasEnoughForBonus(playerIndex: number, bonusTile: BonusTile, cards: Card[]): boolean {
  const ownershipNum = getIntegerRepresentingPlayerCardOwnershipLocation(playerIndex);
  let insufficientFunds = 0;
  const squares = [0, 0, 0, 0, 0];
  cards.forEach(card => {
    if (card.cardLocation === ownershipNum) {
      squares[card.color]++;
    }
  });
  for (let i = 0; i < bonusTile.cost.length; i++) {
    if (bonusTile.cost[i] > squares[i]) {
      insufficientFunds++;
    }
  }
  return insufficientFunds > 0;
}
