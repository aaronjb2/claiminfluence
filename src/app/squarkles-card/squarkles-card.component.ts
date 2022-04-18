import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from '../squarekles-game/interfaces/card';
import {WebSocketService} from '../web-socket.service';
import { getColorCodeByIndex } from '../functions/getColorCodeByIndex';
import { getNthElementWithNonZeroValue } from '../functions/getNthElementWithNonZeroValue';
import { getTotalItemsWithNonZeroCost } from '../functions/getTotalItemsWithNonZeroCost';
import { getColorCost } from '../functions/getColorCost';
import { getCostColor } from '../functions/getCostColor';
import {SquarekleGame} from '../squarekles-game/interfaces/squarekle-game';
import {Player} from '../squarekles-game/interfaces/player';
import {getTotalPurchasePowerBeforeRandomTokens} from '../functions/get-total-purchase-power-before-random-tokens';
import {canBuy} from '../functions/can-buy';
import {getTotalReservedCards} from '../functions/get-total-reserved-cards';
import {Tiers} from '../squarekles-game/enums/tiers';
import {CardLocation} from '../squarekles-game/enums/card-location';
import {ItemBeingDisplayed} from '../squarekles-game/enums/item-being-displayed';

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
  @Input() itemBeingDisplayed: number;
  @Output() getItemBeingDisplayedChange = new EventEmitter<number>();

  Tiers = Tiers;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {

  }
  getCostColor(arr: number[], index: number): string { return getCostColor(arr, index); }
  getColorCost(arr: number[], index: number): number { return getColorCost(arr, index); }
  getTotalItemsWithNonZeroCost(arr: number[]): number { return getTotalItemsWithNonZeroCost(arr); }
  getColorCodeByIndex(index: number): string { return getColorCodeByIndex(index); }
  getTotalPurchasePowerBeforeRandomTokens(color: number, playerIndex: number, player: Player, cards: Card[]): number {
    return getTotalPurchasePowerBeforeRandomTokens(color, playerIndex, player, cards);
  }
  canBuy(color: number, playerIndex: number, player: Player, cards: Card[], cost: number[]): boolean {
    return canBuy(color, playerIndex, player, cards, cost);
  }

  getHashtagsQuantityExistence(hashtagQuantity): boolean {
    return this.card && this.card.hashtags && this.card.hashtags === hashtagQuantity && this.game && this.game.hashtagMode;
  }

  buyButtonShouldAppear(): boolean {
    return this.buyShouldAppear;
  }

  reserveButtonShouldAppear(): boolean {
    return this.reserveShouldAppear;
  }

  positiveContemplatedCircle(): boolean {
    let oneIsPositive = false;
    if (this.game) {
      this.game.contemplatedCirclesToTake.forEach(circle => {
        if (circle > 0) {
          oneIsPositive = true;
        }
      });
    }
    return oneIsPositive;
  }

  evaluateIfBuyButtonShouldBeEnabled(): boolean {
    return this.game
      && this.game.started
      && (this.game.turn || this.game.turn === 0)
      && canBuy(this.card.color, this.game.turn, this.game.players[this.game.turn], this.game.cards, this.card.cost)
      && !this.positiveContemplatedCircle()
      && !this.game.selectABonus;
  }

  evaluateIfReserveButtonShouldBeEnabled(): boolean {
    return this.game
      && this.game.started
      && (this.game.turn || this.game.turn === 0)
      && getTotalReservedCards(this.game.cards, this.game.turn) < 3
      && !this.positiveContemplatedCircle()
      && !this.game.selectABonus;
  }

  getItemToDisplay(): number {
    if (this.card.cardLocation === CardLocation.TopTierSlot0) {
      return ItemBeingDisplayed.ReservedTopTierCard0;
    }
    if (this.card.cardLocation === CardLocation.TopTierSlot1) {
      return ItemBeingDisplayed.ReservedTopTierCard1;
    }
    if (this.card.cardLocation === CardLocation.TopTierSlot2) {
      return ItemBeingDisplayed.ReservedTopTierCard2;
    }
    if (this.card.cardLocation === CardLocation.TopTierSlot3) {
      return ItemBeingDisplayed.ReservedTopTierCard3;
    }
    if (this.card.cardLocation === CardLocation.MiddleTierSlot0) {
      return ItemBeingDisplayed.ReservedMiddleTierCard0;
    }
    if (this.card.cardLocation === CardLocation.MiddleTierSlot1) {
      return ItemBeingDisplayed.ReservedMiddleTierCard1;
    }
    if (this.card.cardLocation === CardLocation.MiddleTierSlot2) {
      return ItemBeingDisplayed.ReservedMiddleTierCard2;
    }
    if (this.card.cardLocation === CardLocation.MiddleTierSlot3) {
      return ItemBeingDisplayed.ReservedMiddleTierCard3;
    }
    if (this.card.cardLocation === CardLocation.BottomTierSlot0) {
      return ItemBeingDisplayed.ReservedBottomTierCard0;
    }
    if (this.card.cardLocation === CardLocation.BottomTierSlot1) {
      return ItemBeingDisplayed.ReservedBottomTierCard1;
    }
    if (this.card.cardLocation === CardLocation.BottomTierSlot2) {
      return ItemBeingDisplayed.ReservedBottomTierCard2;
    }
    if (this.card.cardLocation === CardLocation.BottomTierSlot3) {
      return ItemBeingDisplayed.ReservedBottomTierCard3;
    }
  }

  reserve(): void {
    const itemToDisplay = this.getItemToDisplay();
    this.getItemBeingDisplayedChange.emit(itemToDisplay);
  }
}
