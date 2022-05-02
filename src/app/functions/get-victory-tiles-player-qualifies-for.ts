import {SquarekleGame} from '../squarekles-game/interfaces/squarekle-game';
import {BonusLocation} from '../squarekles-game/enums/bonus-location';
import {hasEnoughForBonus} from './has-enough-for-bonus';

export function getVictoryTilesPlayerQualifiesFor(game: SquarekleGame): number[] {
  const victoryTilesQualifiedFor = [];
  const slot0Tiles = game.bonusTiles.filter(tile => tile.bonusLocation === BonusLocation.Slot0);
  const slot1Tiles = game.bonusTiles.filter(tile => tile.bonusLocation === BonusLocation.Slot1);
  const slot2Tiles = game.bonusTiles.filter(tile => tile.bonusLocation === BonusLocation.Slot2);
  const slot3Tiles = game.bonusTiles.filter(tile => tile.bonusLocation === BonusLocation.Slot3);
  const slot4Tiles = game.bonusTiles.filter(tile => tile.bonusLocation === BonusLocation.Slot4);
  if (slot0Tiles.length > 0) {
    if (hasEnoughForBonus(game.turn, slot0Tiles[0], game.cards)) {
      victoryTilesQualifiedFor.push(0);
    }
  }
  if (slot1Tiles.length > 0) {
    if (hasEnoughForBonus(game.turn, slot1Tiles[0], game.cards)) {
      victoryTilesQualifiedFor.push(1);
    }
  }
  if (slot2Tiles.length > 0) {
    if (hasEnoughForBonus(game.turn, slot2Tiles[0], game.cards)) {
      victoryTilesQualifiedFor.push(2);
    }
  }
  if (slot3Tiles.length > 0) {
    if (hasEnoughForBonus(game.turn, slot3Tiles[0], game.cards)) {
      victoryTilesQualifiedFor.push(3);
    }
  }
  if (slot4Tiles.length > 0) {
    if (hasEnoughForBonus(game.turn, slot4Tiles[0], game.cards)) {
      victoryTilesQualifiedFor.push(4);
    }
  }
  return victoryTilesQualifiedFor;
}
