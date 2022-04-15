import {CardLocation} from '../squarekles-game/enums/card-location';

export function getIntegerRepresentingPlayerCardSecretReservedLocation(index: number): number {
  if (index === 3) {
    return CardLocation.Player3SecretReserved;
  }
  if (index === 2) {
    return CardLocation.Player2SecretReserved;
  }
  if (index === 1) {
    return CardLocation.Player1SecretReserved;
  }
  return CardLocation.Player0SecretReserved;
}
