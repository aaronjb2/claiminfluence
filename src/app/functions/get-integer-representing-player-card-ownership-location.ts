import {CardLocation} from '../squarekles-game/enums/card-location';

export function getIntegerRepresentingPlayerCardOwnershipLocation(index: number): number {
  if (index === 3) {
    return CardLocation.Player3Owned;
  }
  if (index === 2) {
    return CardLocation.Player2Owned;
  }
  if (index === 1) {
    return CardLocation.Player1Owned;
  }
  return CardLocation.Player0Owned;
}
