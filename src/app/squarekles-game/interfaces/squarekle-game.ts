import { Player } from './player';
import { Card } from './card';
import { BonusTile } from './bonus-tile';
import { ISquareklesGame } from './i-squarekles-game';

export class SquarekleGame implements ISquareklesGame {
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

  constructor(identifier: string, started: boolean, turn: number, gameVersion: number, mustBuyTopTierSquareToWin: boolean,
              mustHaveOneSquareOfEachColorToWin, hashtagMode: boolean, contemplatedCirclesToTake: number[],
              contemplatedCirclesToPutBack: number[], players: Player[], cards: Card[], bonusTiles: BonusTile[]) {
    this.identifier = identifier;
    this.started = started;
    this.turn = turn;
    this.gameVersion = gameVersion;
    this.mustBuyTopTierSquareToWin = mustBuyTopTierSquareToWin;
    this.mustHaveOneSquareOfEachColorToWin = mustHaveOneSquareOfEachColorToWin;
    this.hashtagMode = hashtagMode;
    this.contemplatedCirclesToTake = contemplatedCirclesToTake;
    this.contemplatedCirclesToPutBack = contemplatedCirclesToPutBack;
    this.players = players;
    this.cards = cards;
    this.bonusTiles = bonusTiles;
}
}
