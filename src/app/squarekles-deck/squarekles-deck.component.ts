import {Component, Input, OnInit} from '@angular/core';
import { getColorCodeByIndex } from '../functions/getColorCodeByIndex';
import { getNthElementWithNonZeroValue } from '../functions/getNthElementWithNonZeroValue';
import { getTotalItemsWithNonZeroCost } from '../functions/getTotalItemsWithNonZeroCost';
import { getColorCost } from '../functions/getColorCost';
import { getCostColor } from '../functions/getCostColor';

@Component({
  selector: 'app-squarekles-deck',
  templateUrl: './squarekles-deck.component.html',
  styleUrls: ['./squarekles-deck.component.scss']
})
export class SquareklesDeckComponent implements OnInit {
  @Input() tier: string;
  @Input() game;

  constructor() { }

  ngOnInit(): void {
  }

  getCardsRemaining() {
    let cardsInDeck = this.tier && this.tier === 'top' ? 20 : this.tier && this.tier === 'middle' ? 30 : 40;
    if (this.game) {
      if (this.game.players) {
        for (let i = 0; i < this.game.players.length; i++) {
          if (this.game.players[i].squaresBought) {
            cardsInDeck = cardsInDeck - this.game.players[i].squaresBought.length;
          }
          if (this.game.players[i].indexesOfKnownReservedCards) {
            cardsInDeck = cardsInDeck - this.game.players[i].indexesOfKnownReservedCards.length;
          }
          if (this.game.players[i].indexesOfSecretReservedCards) {
            cardsInDeck = cardsInDeck - this.game.players[i].indexesOfSecretReservedCards.length;
          }
        }
      }
    }
    return cardsInDeck - 4;
  }

}
