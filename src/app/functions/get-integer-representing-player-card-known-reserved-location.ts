import {CardLocation} from '../squarekles-game/enums/card-location';

export function getIntegerRepresentingPlayerCardKnownReservedLocation(index: number): number {
  if (index === 3) {
    return CardLocation.Player3KnownReserved;
  }
  if (index === 2) {
    return CardLocation.Player2KnownReserved;
  }
  if (index === 1) {
    return CardLocation.Player1KnownReserved;
  }
  return CardLocation.Player0KnownReserved;
}
