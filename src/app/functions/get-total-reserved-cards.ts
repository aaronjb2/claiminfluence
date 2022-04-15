import {getIntegerRepresentingPlayerCardSecretReservedLocation} from './get-integer-representing-player-card-secret-reserved-location';
import {getIntegerRepresentingPlayerCardKnownReservedLocation} from './get-integer-representing-player-card-known-reserved-location';
import {Card} from '../squarekles-game/interfaces/card';

export function getTotalReservedCards(cards: Card[], playerIndex: number): number {
  const secretReservedNum = getIntegerRepresentingPlayerCardSecretReservedLocation(playerIndex);
  const knownReservedNum = getIntegerRepresentingPlayerCardKnownReservedLocation(playerIndex);
  let reservedCardsSum = 0;
  cards.forEach(card => {
    reservedCardsSum += (card.cardLocation === secretReservedNum || card.cardLocation === knownReservedNum ? 1 : 0);
  });
  return reservedCardsSum;
}
