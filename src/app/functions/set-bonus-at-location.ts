import {BonusTile} from '../squarekles-game/interfaces/bonus-tile';
import {BonusLocation} from '../squarekles-game/enums/bonus-location';
import {randomNumber} from './randomNumber';

export function setBonusAtLocation(bonusTiles: BonusTile[], location: number, hashtagMode: boolean): void {
  if (hashtagMode && location === BonusLocation.Slot2) {
    const zeroLengthCostArrayBonuses = bonusTiles.filter(bonusTile => bonusTile.cost.length === 0);
    zeroLengthCostArrayBonuses[0].bonusLocation = location;
  } else {
    const availableTiles = bonusTiles.filter(bonusTile => bonusTile.cost.length > 0
      && isNowhere(bonusTile.bonusLocation) && !bonusTile.otherSideTaken);
    const randomNum = randomNumber(0, availableTiles.length - 1);
    availableTiles[randomNum].bonusLocation = location;
    if (randomNum % 2 === 0) {
      availableTiles[randomNum + 1].otherSideTaken = true;
    } else {
      availableTiles[randomNum - 1].otherSideTaken = true;
    }
  }
}

function isNowhere(location: number): boolean {
  return location !== BonusLocation.Player0Owned
    && location !== BonusLocation.Player1Owned
    && location !== BonusLocation.Player2Owned
    && location !== BonusLocation.Player3Owned
    && location !== BonusLocation.Slot0
    && location !== BonusLocation.Slot1
    && location !== BonusLocation.Slot2
    && location !== BonusLocation.Slot3
    && location !== BonusLocation.Slot4;
}
