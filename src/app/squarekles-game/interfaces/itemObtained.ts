import {Card} from './card';
import {BonusTile} from './bonus-tile';

export interface ItemObtained {
  isBonus: boolean;
  card: Card;
  bonus: BonusTile;
}
