import {BonusTile} from '../squarekles-game/interfaces/bonus-tile';

export function removeBonusAtLocation(bonusTiles: BonusTile[], location: number): void {
  for (let i = 0; i < bonusTiles.length; i++) {
    if (bonusTiles[i].bonusLocation === location) {
      bonusTiles[i].bonusLocation = -1;
      if (bonusTiles[i].cost.length !== 0) {
        if (i % 2 === 0) {
          bonusTiles[i + 1].otherSideTaken = false;
        } else {
          bonusTiles[i - 1].otherSideTaken = false;
        }
      }
    }
  }
}
