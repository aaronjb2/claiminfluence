import {Card} from '../squarekles-game/interfaces/card';
import {getIntegerRepresentingPlayerCardOwnershipLocation} from './get-integer-representing-player-card-ownership-location';

export function getTotalHashtagsOfPlayer(playerIndex: number, cards: Card[]): number {
  const ownershipNum = getIntegerRepresentingPlayerCardOwnershipLocation(playerIndex);
  let hashtagQuantity = 0;
  cards.forEach(card => {
    if (card.cardLocation === ownershipNum) {
      hashtagQuantity += card.hashtags;
    }
  });
  return hashtagQuantity;
}
