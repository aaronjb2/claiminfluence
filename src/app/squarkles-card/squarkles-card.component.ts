import {Component, Input, OnInit} from '@angular/core';
import {Card} from '../squarekles-game/interfaces/card';
import {WebSocketService} from '../web-socket.service';
import { getColorCodeByIndex } from '../functions/getColorCodeByIndex';
import { getNthElementWithNonZeroValue } from '../functions/getNthElementWithNonZeroValue';
import { getTotalItemsWithNonZeroCost } from '../functions/getTotalItemsWithNonZeroCost';
import { getColorCost } from '../functions/getColorCost';
import { getCostColor } from '../functions/getCostColor';
import {SquarekleGame} from '../squarekles-game/interfaces/squarekle-game';

@Component({
  selector: 'app-squarkles-card',
  templateUrl: './squarkles-card.component.html',
  styleUrls: ['./squarkles-card.component.scss']
})
export class SquarklesCardComponent implements OnInit {
  @Input() card: Card;
  @Input() game: SquarekleGame;
  @Input() buyShouldAppear: boolean;
  @Input() reserveShouldAppear: boolean;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {

  }
  getCostColor(arr: number[], index: number): string { return getCostColor(arr, index); }
  getColorCost(arr: number[], index: number): number { return getColorCost(arr, index); }
  getTotalItemsWithNonZeroCost(arr: number[]): number { return getTotalItemsWithNonZeroCost(arr); }
  getColorCodeByIndex(index: number): string { return getColorCodeByIndex(index); }

  getHashtagsQuantityExistence(hashtagQuantity): boolean {
    return this.card && this.card.hashtags && this.card.hashtags === hashtagQuantity && this.game && this.game.hashtagMode;
  }

  buyButtonShouldAppear() {
    return this.buyShouldAppear;
  }

  reserveButtonShouldAppear() {
    return this.reserveShouldAppear;
  }
}
