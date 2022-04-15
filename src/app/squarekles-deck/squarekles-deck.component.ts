import {Component, Input, OnInit} from '@angular/core';
import { getColorCodeByIndex } from '../functions/getColorCodeByIndex';
import { getNthElementWithNonZeroValue } from '../functions/getNthElementWithNonZeroValue';
import { getTotalItemsWithNonZeroCost } from '../functions/getTotalItemsWithNonZeroCost';
import { getColorCost } from '../functions/getColorCost';
import { getCostColor } from '../functions/getCostColor';
import {Card} from '../squarekles-game/interfaces/card';
import {SquarekleGame} from '../squarekles-game/interfaces/squarekle-game';
import {CardLocation} from '../squarekles-game/enums/card-location';
import {getTotalReservedCards} from '../functions/get-total-reserved-cards';

@Component({
  selector: 'app-squarekles-deck',
  templateUrl: './squarekles-deck.component.html',
  styleUrls: ['./squarekles-deck.component.scss']
})
export class SquareklesDeckComponent implements OnInit {
  @Input() tier: string;
  @Input() game: SquarekleGame;
  displayingRemainingCards: boolean = false;
  pageNumber: number = 1;

  constructor() { }

  ngOnInit(): void {
    this.getDeckCardsForDisplay();
  }

  getCardsRemaining(): number {
    if (this.game) {
      return this.game.cards.filter(x => x.tier === this.tier && x.cardLocation === CardLocation.Deck).length;
    }
    return 0;
  }

  getGenericCard(): Card {
    return {
      tier: 'bottom',
      color: 0,
      cost: [1, 1, 1, 1, 0],
      pointValue: 0,
      hashtags: 0,
      gameVersion: 0,
      cardLocation: CardLocation.Deck
    };
  }

  getQuantityOfSecretsHeldByPlayers(): number {
    if (this.game) {
      return this.game.cards.filter(x => x.cardLocation === CardLocation.Player0Owned
        || x.cardLocation === CardLocation.Player1Owned
        || x.cardLocation === CardLocation.Player2Owned
        || x.cardLocation === CardLocation.Player3Owned).length;
    }
    return 0;
  }

  getTotalPages() {
    const totalObtainedItems = this.getCardsRemaining() + this.getQuantityOfSecretsHeldByPlayers();
    return totalObtainedItems === 0 ? 1 : totalObtainedItems % 3 === 0 ? totalObtainedItems / 3 : totalObtainedItems % 3 === 1 ? (totalObtainedItems + 2) / 3 : (totalObtainedItems + 1) / 3;
  }

  changePageNumber(decrease = false) {
    if (decrease) {
      this.pageNumber--;
    } else {
      this.pageNumber++;
    }
  }

  startDisplayingRemainingCards() {
    this.displayingRemainingCards = true;
  }

  stopDisplayingRemainingCards() {
    this.displayingRemainingCards = false;
    this.pageNumber = 1;
  }

  getDeckCardsForDisplay(): Card[] {
    if (this.game) {
      return this.game.cards.filter(x => (x.cardLocation === CardLocation.Deck
        || x.cardLocation === CardLocation.Player0SecretReserved
        || x.cardLocation === CardLocation.Player1SecretReserved
        || x.cardLocation === CardLocation.Player2SecretReserved
        || x.cardLocation === CardLocation.Player3SecretReserved)
        && x.tier === this.tier);
    }
    return [];
  }

  getIndexOfItemToLookAt(index): number {
    return this.pageNumber * 3 - 3 + index;
  }

  evaluateIfCardShouldAppear(index): boolean {
    const indexOfItemToLookAt = this.getIndexOfItemToLookAt(index);
    const deck = this.getDeckCardsForDisplay();
    return !!deck[indexOfItemToLookAt];
  }

  getCardThatShouldAppear(index): Card {
    if (this.game) {
      const indexOfItemToLookAt = this.getIndexOfItemToLookAt(index);
      const deck = this.getDeckCardsForDisplay();
      const card = deck[indexOfItemToLookAt];
      if (card) {
        return card;
      }
    }
    return this.getGenericCard();
  }

  evaluateIfReserveButtonShouldBeEnabled(): boolean {
    return getTotalReservedCards(this.game.cards, this.game.turn) < 3 && this.game.started;
  }
}
