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
          if (this.tier) {
            if (this.tier === 'bottom') {
              if (this.game.players[i].bottomTierSquaresBought) {
                cardsInDeck = cardsInDeck - this.game.players[i].bottomTierSquaresBought.length;
              }
              if (this.game.players[i].indexesOfBottomTierKnownReservedCards) {
                cardsInDeck = cardsInDeck - this.game.players[i].indexesOfBottomTierKnownReservedCards.length;
              }
              if (this.game.players[i].indexesOfBottomTierSecretReservedCards) {
                cardsInDeck = cardsInDeck - this.game.players[i].indexesOfBottomTierSecretReservedCards.length;
              }
            }
            if (this.tier === 'middle') {
              if (this.game.players[i].middleTierSquaresBought) {
                cardsInDeck = cardsInDeck - this.game.players[i].middleTierSquaresBought.length;
              }
              if (this.game.players[i].indexesOfMiddleTierKnownReservedCards) {
                cardsInDeck = cardsInDeck - this.game.players[i].indexesOfMiddleTierKnownReservedCards.length;
              }
              if (this.game.players[i].indexesOfMiddleTierSecretReservedCards) {
                cardsInDeck = cardsInDeck - this.game.players[i].indexesOfMiddleTierSecretReservedCards.length;
              }
            }
            if (this.tier === 'top') {
              if (this.game.players[i].topTierSquaresBought) {
                cardsInDeck = cardsInDeck - this.game.players[i].topTierSquaresBought.length;
              }
              if (this.game.players[i].indexesOfTopTierKnownReservedCards) {
                cardsInDeck = cardsInDeck - this.game.players[i].indexesOfTopTierKnownReservedCards.length;
              }
              if (this.game.players[i].indexesOfTopTierSecretReservedCards) {
                cardsInDeck = cardsInDeck - this.game.players[i].indexesOfTopTierSecretReservedCards.length;
              }
            }
          }
        }
      }
    }
    return cardsInDeck - 4;
  }

}
