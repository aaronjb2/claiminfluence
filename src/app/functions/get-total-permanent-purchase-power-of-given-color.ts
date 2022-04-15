import {Card} from '../squarekles-game/interfaces/card';
import {getIntegerRepresentingPlayerCardOwnershipLocation} from './get-integer-representing-player-card-ownership-location';

export function getTotalPermanentPurchasePowerOfGivenColor(color: number, playerIndex: number, cards: Card[]): number {
  const ownershipNumber = getIntegerRepresentingPlayerCardOwnershipLocation(playerIndex);
  let squares = 0;
  cards.forEach(card => {
    if (card.cardLocation === ownershipNumber && card.color === color) {
      squares++;
    }
  });
  return squares;
}
