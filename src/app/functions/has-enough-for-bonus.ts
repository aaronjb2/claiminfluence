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
  bonusTile.cost.forEach((cost, index) => {
    if (cost > squares[index]) {
      insufficientFunds++;
    }
  });
  return insufficientFunds > 0;
}
