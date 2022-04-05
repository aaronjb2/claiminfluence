import {Card} from './card';

export interface ItemObtained {
  isBonus: boolean;
  card: Card;
  bonus: number[];
}
