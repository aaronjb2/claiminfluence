import {randomNumber} from './randomNumber';
import {Card} from '../squarekles-game/interfaces/card';
import {CardLocation} from '../squarekles-game/enums/card-location';

export function setCardAtLocation(cards: Card[], location: number, tier: string): void {
  const availableCards = cards.filter(card => card.cardLocation === CardLocation.Deck && card.tier === tier);
  const randomNum = randomNumber(0, availableCards.length - 1);
  availableCards[randomNum].cardLocation = location;
}
