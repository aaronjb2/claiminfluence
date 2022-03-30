import {Component, Input, OnInit} from '@angular/core';
import {Card} from '../squarekles-game/interfaces/card';
import {WebSocketService} from '../web-socket.service';
import { getColorCodeByIndex } from '../functions/getColorCodeByIndex';
import { getNthElementWithNonZeroValue } from '../functions/getNthElementWithNonZeroValue';
import { getTotalItemsWithNonZeroCost } from '../functions/getTotalItemsWithNonZeroCost';
import { getColorCost } from '../functions/getColorCost';
import { getCostColor } from '../functions/getCostColor';

@Component({
  selector: 'app-squarkles-card',
  templateUrl: './squarkles-card.component.html',
  styleUrls: ['./squarkles-card.component.scss']
})
export class SquarklesCardComponent implements OnInit {
  @Input() card: Card;
  @Input() game;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {

  }
  getCostColor(arr, index) { return getCostColor(arr, index); }
  getColorCost(arr, index) { return getColorCost(arr, index); }
  getTotalItemsWithNonZeroCost(arr) { return getTotalItemsWithNonZeroCost(arr); }
  getColorCodeByIndex(index) { return getColorCodeByIndex(index); }

  getHashtagsQuantityExistence(hashtagQuantity) {
    return this.card && this.card.hashtags && this.card.hashtags === hashtagQuantity && this.game && this.game.hashtagMode;
  }
}
