import {BonusLocation} from "../squarekles-game/enums/bonus-location";

export function getIntegerRepresentingPlayerBonusTileOwnershipLocation(index: number): number {
  if (index === 3) {
    return BonusLocation.Player3Owned;
  }
  if (index === 2) {
    return BonusLocation.Player2Owned;
  }
  if (index === 1) {
    return BonusLocation.Player1Owned;
  }
  return BonusLocation.Player0Owned;
}
