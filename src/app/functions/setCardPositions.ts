import {Card} from '../squarekles-game/interfaces/card';
import {CardLocation} from '../squarekles-game/enums/card-location';
import {Tiers} from '../squarekles-game/enums/tiers';
import { randomNumber } from './randomNumber';

export function setCardPositions(deck: Card[]) {
  setACardToATierIfNeeded(deck, CardLocation.TopTierSlot0, Tiers.Top);
  setACardToATierIfNeeded(deck, CardLocation.TopTierSlot1, Tiers.Top);
  setACardToATierIfNeeded(deck, CardLocation.TopTierSlot2, Tiers.Top);
  setACardToATierIfNeeded(deck, CardLocation.TopTierSlot3, Tiers.Top);
  setACardToATierIfNeeded(deck, CardLocation.MiddleTierSlot0, Tiers.Middle);
  setACardToATierIfNeeded(deck, CardLocation.MiddleTierSlot1, Tiers.Middle);
  setACardToATierIfNeeded(deck, CardLocation.MiddleTierSlot2, Tiers.Middle);
  setACardToATierIfNeeded(deck, CardLocation.MiddleTierSlot3, Tiers.Middle);
  setACardToATierIfNeeded(deck, CardLocation.BottomTierSlot0, Tiers.Bottom);
  setACardToATierIfNeeded(deck, CardLocation.BottomTierSlot1, Tiers.Bottom);
  setACardToATierIfNeeded(deck, CardLocation.BottomTierSlot2, Tiers.Bottom);
  setACardToATierIfNeeded(deck, CardLocation.BottomTierSlot3, Tiers.Bottom);
}

function setACardToATierIfNeeded(deck: Card[], cardLocation: number, tier: string): void {
  const cardsAtPosition = deck.filter(x => x.cardLocation === cardLocation);
  const cardsAtTierStillInDeck = deck.filter(x => x.cardLocation === CardLocation.Deck && x.tier === tier);
  if (cardsAtPosition.length === 0 && cardsAtTierStillInDeck.length > 0) {
    const randomIndex = randomNumber(0, cardsAtTierStillInDeck.length - 1);
    cardsAtTierStillInDeck[randomIndex].cardLocation = cardLocation;
  }
}
