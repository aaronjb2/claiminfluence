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

  getColorCodeByIndex(index) { return getColorCodeByIndex(index); }

  isDoubleDigit(index) {
    return false;
  }

  getTotalTokens() {
    return 9;
  }

  getTotalPermanentPurchasingPower(index) {
    return 9;
  }

  getTotalPermanentPurchasingPowerPlusOneTimePurchasingPower(index) {
    return 9;
  }

  getPlayerPoints() {
    return 0;
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

  getIntegerRepresentingPlayerCardOwnershipLocation(index: number): number {
    if (index === 3) {
      return CardLocation.Player3Owned;
    }
    if (index === 2) {
      return CardLocation.Player2Owned;
    }
    if (index === 1) {
      return CardLocation.Player1Owned;
    }
    return CardLocation.Player0Owned;
  }

  getIntegerRepresentingPlayerCardKnownReservedLocation(index: number): number {
    if (index === 3) {
      return CardLocation.Player3KnownReserved;
    }
    if (index === 2) {
      return CardLocation.Player2KnownReserved;
    }
    if (index === 1) {
      return CardLocation.Player1KnownReserved;
    }
    return CardLocation.Player0KnownReserved;
  }

  getIntegerRepresentingPlayerCardSecretReservedLocation(index: number): number {
    if (index === 3) {
      return CardLocation.Player3SecretReserved;
    }
    if (index === 2) {
      return CardLocation.Player2SecretReserved;
    }
    if (index === 1) {
      return CardLocation.Player1SecretReserved;
    }
    return CardLocation.Player0SecretReserved;
  }

  getIntegerRepresentingPlayerBonusTileOwnershipLocation(index: number): number {
    if (index === 3) {
      return BonusLocation.Player3Owned;
    }
    if (index === 2) {
      return BonusLocation.Player2Owned;
    }
    if (index === 1) {
      return BonusLocation.Player1Owned;
    }
    return BonusLocation.Player0Owned;
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

  stopDisplayingAtIndex(index) {
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
}
