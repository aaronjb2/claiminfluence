import {Card} from '../squarekles-game/interfaces/card';
import {getIntegerRepresentingPlayerCardOwnershipLocation} from './get-integer-representing-player-card-ownership-location';
import {BonusTile} from '../squarekles-game/interfaces/bonus-tile';
import {getIntegerRepresentingPlayerBonusTileOwnershipLocation} from './get-integer-representing-player-bonus-tile-ownership-location';

export function getPlayerPoints(playerIndex: number, cards: Card[], bonusTiles: BonusTile[]): number {
  const ownershipNumCards = getIntegerRepresentingPlayerCardOwnershipLocation(playerIndex);
  const ownershipNumBonuses = getIntegerRepresentingPlayerBonusTileOwnershipLocation(playerIndex);
  let points = 0;
  cards.forEach(card => {
    if (card.cardLocation === ownershipNumCards) {
      points += card.pointValue;
    }
  });
  bonusTiles.forEach(bonus => {
    if (bonus.bonusLocation === ownershipNumBonuses) {
      points += 3;
    }
  });
  return points;
}
