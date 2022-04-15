import {Component, Input, OnInit} from '@angular/core';
import {Card} from '../squarekles-game/interfaces/card';
import {WebSocketService} from '../web-socket.service';
import { getColorCodeByIndex } from '../functions/getColorCodeByIndex';
import { getNthElementWithNonZeroValue } from '../functions/getNthElementWithNonZeroValue';
import { getTotalItemsWithNonZeroCost } from '../functions/getTotalItemsWithNonZeroCost';
import { getColorCost } from '../functions/getColorCost';
import { getCostColor } from '../functions/getCostColor';
import {BonusTile} from '../squarekles-game/interfaces/bonus-tile';
import {hasEnoughForBonus} from "../functions/has-enough-for-bonus";

@Component({
  selector: 'app-squarkles-bonus',
  templateUrl: './squarkles-bonus.component.html',
  styleUrls: ['./squarkles-bonus.component.scss']
})
export class SquarklesBonusComponent implements OnInit {
  @Input() victoryTile: BonusTile;
  @Input() game;

  constructor(private webSocketService: WebSocketService) { }

  hasEnoughForBonus(playerIndex: number, bonusTile: BonusTile, cards: Card[]): boolean { return hasEnoughForBonus(playerIndex, bonusTile, cards); }

  ngOnInit(): void {
  }
  getCostColor(arr: number[], index: number): string { return getCostColor(arr, index, 3); }
  getColorCost(arr: number[], index: number): number { return getColorCost(arr, index, 3); }
  getTotalItemsWithNonZeroCost(arr: number[]): number { return getTotalItemsWithNonZeroCost(arr); }

  selectButtonShouldAppear(): boolean {
    return this.game.selectABonus && this.hasEnoughForBonus(this.game.turn, this.victoryTile, this.game.cards);
  }

}
