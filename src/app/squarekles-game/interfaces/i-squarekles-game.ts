import {Player} from './player';
import {Card} from './card';
import {BonusTile} from './bonus-tile';

export interface ISquareklesGame {
  identifier: string;
  started: boolean;
  turn: number;
  gameVersion: number;
  mustBuyTopTierSquareToWin: boolean;
  mustHaveOneSquareOfEachColorToWin: boolean;
  hashtagMode: boolean;
  contemplatedCirclesToTake: number[];
  contemplatedCirclesToPutBack: number[];
  players: Player[];
  cards: Card[];
  bonusTiles: BonusTile[];
}
