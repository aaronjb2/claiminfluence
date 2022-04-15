import {Component, Input, OnInit} from '@angular/core';
import { getColorCodeByIndex } from '../functions/getColorCodeByIndex';
import { getNthElementWithNonZeroValue } from '../functions/getNthElementWithNonZeroValue';
import { getTotalItemsWithNonZeroCost } from '../functions/getTotalItemsWithNonZeroCost';
import { getColorCost } from '../functions/getColorCost';
import { getCostColor } from '../functions/getCostColor';
import { SquarklesCardComponent } from '../squarkles-card/squarkles-card.component';
import {WebSocketService} from '../web-socket.service';
import {ItemObtained} from '../squarekles-game/interfaces/itemObtained';
import {Card} from '../squarekles-game/interfaces/card';
import {SquarekleGame} from '../squarekles-game/interfaces/squarekle-game';
import {CardLocation} from '../squarekles-game/enums/card-location';
import {BonusLocation} from '../squarekles-game/enums/bonus-location';
import {BonusTile} from '../squarekles-game/interfaces/bonus-tile';
import {getIntegerRepresentingPlayerCardKnownReservedLocation} from '../functions/get-integer-representing-player-card-known-reserved-location';
import {getIntegerRepresentingPlayerCardOwnershipLocation} from '../functions/get-integer-representing-player-card-ownership-location';
import {getIntegerRepresentingPlayerCardSecretReservedLocation} from '../functions/get-integer-representing-player-card-secret-reserved-location';
import {getIntegerRepresentingPlayerBonusTileOwnershipLocation} from '../functions/get-integer-representing-player-bonus-tile-ownership-location';
import {getTotalPermanentPurchasePowerOfGivenColor} from '../functions/get-total-permanent-purchase-power-of-given-color';
import {getTotalHashtagsOfPlayer} from '../functions/get-total-hashtags-of-player';
import {getPlayerPoints} from '../functions/get-player-points';
import {Tiers} from "../squarekles-game/enums/tiers";

@Component({
  selector: 'app-squarkles-avatar',
  templateUrl: './squarkles-avatar.component.html',
  styleUrls: ['./squarkles-avatar.component.scss']
})
export class SquarklesAvatarComponent implements OnInit {
  @Input() index: number;
  @Input() game: SquarekleGame;
  typedName = '';
  changingName: boolean = false;
  itemBeingDisplayed: number = -1;
  pageNumber: number = 1;
  displayingIndex0: boolean = false;
  displayingIndex1: boolean = false;
  displayingIndex2: boolean = false;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
  }

  getIntegerRepresentingPlayerCardKnownReservedLocation(index: number): number { return getIntegerRepresentingPlayerCardKnownReservedLocation(index); }
  getIntegerRepresentingPlayerCardSecretReservedLocation(index: number): number { return getIntegerRepresentingPlayerCardSecretReservedLocation(index); }
  getIntegerRepresentingPlayerCardOwnershipLocation(index: number): number { return getIntegerRepresentingPlayerCardOwnershipLocation(index); }
  getIntegerRepresentingPlayerBonusTileOwnershipLocation(index: number): number { return getIntegerRepresentingPlayerBonusTileOwnershipLocation(index); }
  getTotalPermanentPurchasePowerOfGivenColor(color: number): number {
    return getTotalPermanentPurchasePowerOfGivenColor(color, this.index, this.game.cards);
  }

  getColorCodeByIndex(index) { return getColorCodeByIndex(index); }

  isDoubleDigit(index) {
    return false;
  }

  getTotalTokens(): number {
    if (this.game && this.game.players) {
      return this.game.players[this.index].circles.reduce((a, b) => a + b) + this.getQuantityOfTopRowTokens();
    }
    return 0;
  }

  getTotalPermanentPurchasingPower(index) {
    return 9;
  }

  getTotalPermanentPurchasingPowerPlusOneTimePurchasingPower(index) {
    return 9;
  }

  toggleChangingName(newName) {
    if (this.changingName) {
      this.game.players[this.index].name = newName;
      this.webSocketService.emit('update-squarekles-game', this.game);
    }
    this.changingName = !this.changingName;
  }

  setTypedName(newName) {
    this.typedName = newName;
  }

  changeName(updatedName) {
    this.changingName = false;
    if (updatedName !== this.game.players[this.index].name) {
      this.game.players[this.index].name = updatedName;
      this.webSocketService.emit('update-squarekles-game', this.game);
    }
  }

  setItemBeingDisplayed(itemBeingDisplayed) {
    this.itemBeingDisplayed = itemBeingDisplayed;
    if (this.itemBeingDisplayed !== 0 && this.itemBeingDisplayed !== 1) {
      this.pageNumber = 1;
      this.stopDisplayingAtIndex(0);
      this.stopDisplayingAtIndex(1);
      this.stopDisplayingAtIndex(2);
    }
  }

  getTotalObtainedItems() {
    let totalObtainedItems = 0;
    if (this.game) {
      const cardOwnershipNumber = this.getIntegerRepresentingPlayerCardOwnershipLocation(this.index);
      const bonusTileOwnershipNumber = this.getIntegerRepresentingPlayerBonusTileOwnershipLocation(this.index);
      totalObtainedItems += this.game.bonusTiles.filter(x => x.bonusLocation === bonusTileOwnershipNumber).length;
      totalObtainedItems += this.game.cards.filter(x => x.cardLocation === cardOwnershipNumber).length;
    }
    return totalObtainedItems;
  }

  getTotalPages() {
    const totalObtainedItems = this.getTotalObtainedItems();
    return totalObtainedItems === 0 ? 1 : totalObtainedItems % 3 === 0 ? totalObtainedItems / 3 : totalObtainedItems % 3 === 1 ? (totalObtainedItems + 2) / 3 : (totalObtainedItems + 1) / 3;
  }

  changePageNumber(decrease = false) {
    if (decrease) {
      this.pageNumber--;
    } else {
      this.pageNumber++;
    }
  }

  getGenericCard(): Card {
    return {
      tier: 'bottom',
      color: 0,
      cost: [1, 1, 1, 1, 0],
      pointValue: 0,
      hashtags: 0,
      gameVersion: 0,
      cardLocation: this.getIntegerRepresentingPlayerCardOwnershipLocation(this.index)
    };
  }

  getGenericVictoryTile(): BonusTile {
    return {
      cost: [3, 3, 3, 0, 0],
      gameVersion: 0,
      bonusLocation: this.getIntegerRepresentingPlayerBonusTileOwnershipLocation(this.index),
      otherSideTaken: false
    };
  }

  getItemsObtainedArray(): ItemObtained[] {
    const itemsObtained = [];
    if (this.game) {
      const playerBonusOwnershipNumber = this.getIntegerRepresentingPlayerBonusTileOwnershipLocation(this.index);
      const playerCardOwnershipNumber = this.getIntegerRepresentingPlayerCardOwnershipLocation(this.index);
      const bonuses = this.game.bonusTiles.filter(x => x.bonusLocation === playerBonusOwnershipNumber);
      const cards = this.game.cards.filter(x => x.cardLocation === playerCardOwnershipNumber);
      for (let i = 0; i < bonuses.length; i++) {
        itemsObtained.push({
          isBonus: true,
          bonus: bonuses[i],
          card: this.getGenericCard()
        });
      }
      for (let i = 0; i < cards.length; i++) {
        itemsObtained.push({
          isBonus: false,
          bonus: this.getGenericVictoryTile(),
          card: cards[i]
        });
      }
    }
    return itemsObtained;
  }

  getIndexOfItemToLookAt(index): number {
    return this.pageNumber * 3 - 3 + index;
  }

  evaluateIfCardShouldExist(index) {
    const indexOfItemToLookAt = this.getIndexOfItemToLookAt(index);
    const itemsObtainedArray = this.getItemsObtainedArray();
    return indexOfItemToLookAt <= itemsObtainedArray.length - 1 && !itemsObtainedArray[indexOfItemToLookAt].isBonus;
  }

  evaluateIfBonusShouldExist(index) {
    const indexOfItemToLookAt = this.getIndexOfItemToLookAt(index);
    const itemsObtainedArray = this.getItemsObtainedArray();
    return indexOfItemToLookAt <= itemsObtainedArray.length - 1 && itemsObtainedArray[indexOfItemToLookAt].isBonus;
  }

  getQuantityOfSecretReservedCards(): number {
    let numberOfSecretReservedCards = 0;
    if (this.game) {
      const secretNum = this.getIntegerRepresentingPlayerCardSecretReservedLocation(this.index);
      numberOfSecretReservedCards = this.game.cards.filter(x => x.cardLocation === secretNum).length;
    }
    return numberOfSecretReservedCards;
  }

  getQuantityOfKnownReservedCards(): number {
    let numberOfKnownReservedCards = 0;
    if (this.game) {
      const knownNum = this.getIntegerRepresentingPlayerCardKnownReservedLocation(this.index);
      numberOfKnownReservedCards = this.game.cards.filter(x => x.cardLocation === knownNum).length;
    }
    return numberOfKnownReservedCards;
  }

  getReservedCards(): Card[] {
    if (this.game) {
      const secretNum = this.getIntegerRepresentingPlayerCardSecretReservedLocation(this.index);
      const knownNum = this.getIntegerRepresentingPlayerCardKnownReservedLocation(this.index);
      return this.game.cards.filter(x => x.cardLocation === secretNum || x.cardLocation === knownNum);
    }
    return [];
  }

  evaluateIfDisplayButtonShouldAppear(index: number): boolean {
    if (this.game) {
      const secretNum = this.getIntegerRepresentingPlayerCardSecretReservedLocation(this.index);
      const reservedCards = this.getReservedCards();
      if (reservedCards[index] && reservedCards[index].cardLocation === secretNum && !this.varForIndexToDisplayIsTrue(index)) {
        return true;
      }
    }
    return false;
  }

  evaluateIfHideButtonShouldAppear(index: number): boolean {
    if (this.game) {
      const secretNum = this.getIntegerRepresentingPlayerCardSecretReservedLocation(this.index);
      const reservedCards = this.getReservedCards();
      if (reservedCards[index] && reservedCards[index].cardLocation === secretNum && this.varForIndexToDisplayIsTrue(index)) {
        return true;
      }
    }
    return false;
  }

  evaluateIfReservedCardShouldAppear(index: number): boolean {
    if (this.game) {
      const secretNum = this.getIntegerRepresentingPlayerCardSecretReservedLocation(this.index);
      const knownNum = this.getIntegerRepresentingPlayerCardKnownReservedLocation(this.index);
      const reservedCards = this.getReservedCards();
      if (reservedCards[index]) {
        if (reservedCards[index].cardLocation === secretNum && this.varForIndexToDisplayIsTrue(index)) {
          return true;
        }
        if (reservedCards[index].cardLocation === knownNum) {
          return true;
        }
      }
    }
    return false;
  }

  getExistingReservedCardThatShouldAppearAtIndex(index): Card {
    const cards = this.getReservedCards();
    return cards[index] ? cards[index] : this.getGenericCard();
  }

  varForIndexToDisplayIsTrue(index): boolean {
    if (index === 0 && this.displayingIndex0) {
      return true;
    }
    if (index === 1 && this.displayingIndex1) {
      return true;
    }
    if (index === 2 && this.displayingIndex2) {
      return true;
    }
    return false;
  }

  startDisplayingAtIndex(index) {
    if (index === 0) {
      this.displayingIndex0 = true;
    }
    if (index === 1) {
      this.displayingIndex1 = true;
    }
    if (index === 2) {
      this.displayingIndex2 = true;
    }
  }

  stopDisplayingAtIndex(index: number): void {
    if (index === 0) {
      this.displayingIndex0 = false;
    }
    if (index === 1) {
      this.displayingIndex1 = false;
    }
    if (index === 2) {
      this.displayingIndex2 = false;
    }
  }

  getCirclesAtIndex(index: number): number {
    if (this.game && this.game.players) {
      return this.game.players[this.index].circles[index];
    }
    return 0;
  }

  getTotalPurchasePowerOfColor(color: number): number {
    return this.getCirclesAtIndex(color) + this.getTotalPermanentPurchasePowerOfGivenColor(color);
  }

  getTotalHashtagsOfPlayer(index: number): number {
    if (this.game && this.game.cards) {
      return getTotalHashtagsOfPlayer(index, this.game.cards);
    }
    return 0;
  }

  getPlayerPoints(index: number): number {
    if (this.game && this.game.cards && this.game.bonusTiles) {
      return getPlayerPoints(index, this.game.cards, this.game.bonusTiles);
    }
    return 0;
  }

  hasHashtagAward(): boolean {
    let hasHashtagAward = false;
    const bonusOwnerShipNum = getIntegerRepresentingPlayerBonusTileOwnershipLocation(this.index);
    if (this.game && this.game.bonusTiles) {
      this.game.bonusTiles.forEach((bonusTile => {
        if (bonusTile.cost.length === 0 && bonusTile.bonusLocation === bonusOwnerShipNum) {
          hasHashtagAward = true;
        }
      }));
    }
    return  hasHashtagAward;
  }

  getQuantityOfTopRowTokens(): number {
    if (!this.game) {
      return 0;
    }
    if (!this.game.mustBuyTopTierSquareToWin) {
      return 0;
    }
    if (!this.game.cards) {
      return 0;
    }
    const ownershipNum = getIntegerRepresentingPlayerCardOwnershipLocation(this.index);
    const quantityOfTopTierCardsOwned = this.game.cards.filter(card => card.tier === Tiers.Top && card.cardLocation === ownershipNum).length;
    return quantityOfTopTierCardsOwned > 0 ? 1 : 0;
  }
}
