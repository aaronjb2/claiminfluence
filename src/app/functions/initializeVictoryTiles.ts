import {BonusTile} from '../squarekles-game/interfaces/bonus-tile';
import {BonusLocation} from '../squarekles-game/enums/bonus-location';
import {randomNumber} from './randomNumber';

export function initializeVictoryTiles(victoryTiles: BonusTile[], numberOfPlayers: number, hashtagMode: boolean) {
  if (hashtagMode) {
    const hashtagVictoryTiles = victoryTiles.filter(x => x.cost.length === 0);
    hashtagVictoryTiles[0].bonusLocation = BonusLocation.Slot2;
  } else {
    const nonhashtagVictoryTiles = victoryTiles.filter(x => x.cost.length > 0 && notInExistingSlot(x.bonusLocation));
    const randomIndex = randomNumber(0, nonhashtagVictoryTiles.length - 1);
    nonhashtagVictoryTiles[randomIndex].bonusLocation = BonusLocation.Slot2;
    if (randomIndex % 2 === 0) {
      nonhashtagVictoryTiles[randomIndex + 1].otherSideTaken = true;
    } else {
      nonhashtagVictoryTiles[randomIndex - 1].otherSideTaken = true;
    }
  }
  setVictoryTileForSlot(victoryTiles, BonusLocation.Slot1);
  setVictoryTileForSlot(victoryTiles, BonusLocation.Slot3);
  if (numberOfPlayers > 2) {
    setVictoryTileForSlot(victoryTiles, BonusLocation.Slot4);
  }
  if (numberOfPlayers > 3) {
    setVictoryTileForSlot(victoryTiles, BonusLocation.Slot0);
  }
}

function setVictoryTileForSlot(victoryTiles: BonusTile[], bonusLocation: number) {
  const remainingAvailableBonusTiles = victoryTiles.filter(x => x.cost.length > 0 && !x.otherSideTaken && notInExistingSlot(x.bonusLocation));
  const randomIndex = randomNumber(0, remainingAvailableBonusTiles.length - 1);
  remainingAvailableBonusTiles[randomIndex].bonusLocation = bonusLocation;
  if (randomIndex % 2 === 0) {
    remainingAvailableBonusTiles[randomIndex + 1].otherSideTaken = false;
  } else {
    remainingAvailableBonusTiles[randomIndex - 1].otherSideTaken = false;
  }
}

function notInExistingSlot(location: number): boolean {
  return location !== BonusLocation.Slot0 && location !== BonusLocation.Slot1 && location !== BonusLocation.Slot2 && location !== BonusLocation.Slot3
    && location !== BonusLocation.Slot4 && location !== BonusLocation.Player0Owned && location !== BonusLocation.Player1Owned
    && location !== BonusLocation.Player2Owned && location !== BonusLocation.Player3Owned;
}
