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
const resourceCardsBottomTierVersion1 = require('../../../resources/resourceCardsBottomTierVersion1.json');
const resourceCardsBottomTierVersion2 = require('../../../resources/resourceCardsBottomTierVersion2.json');
const resourceCardsMiddleTierVersion1 = require('../../../resources/resourceCardsMiddleTierVersion1.json');
const resourceCardsMiddleTierVersion2 = require('../../../resources/resourceCardsMiddleTierVersion2.json');
const resourceCardsTopTierVersion1 = require('../../../resources/resourceCardsTopTierVersion1.json');
const resourceCardsTopTierVersion2 = require('../../../resources/resourceCardsTopTierVersion2.json');
const victoryTilesVersion1 = require('../../../resources/victoryTilesVersion1.json');
const victoryTilesVersion2 = require('../../../resources/victoryTilesVersion2.json');

@Component({
  selector: 'app-squarkles-avatar',
  templateUrl: './squarkles-avatar.component.html',
  styleUrls: ['./squarkles-avatar.component.scss']
})
export class SquarklesAvatarComponent implements OnInit {
  @Input() index: number;
  @Input() game;
  typedName = '';
  changingName: boolean = false;
  itemBeingDisplayed: number = -1;
  pageNumber: number = 1;
  bottomTierCards: Card[];
  middleTierCards: Card[];
  topTierCards: Card[];
  victoryTiles: object[];

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.updateVariables();
  }

  updateVariables() {
    this.bottomTierCards = this.game.gameVersion && this.game.gameVersion === 1 ? resourceCardsBottomTierVersion2 : resourceCardsBottomTierVersion1;
    this.middleTierCards = this.game.gameVersion && this.game.gameVersion === 1 ? resourceCardsMiddleTierVersion2 : resourceCardsMiddleTierVersion1;
    this.topTierCards = this.game.gameVersion && this.game.gameVersion === 1 ? resourceCardsTopTierVersion2 : resourceCardsTopTierVersion1;
    this.victoryTiles = this.game.gameVersion && this.game.gameVersion === 1 ? victoryTilesVersion2 : victoryTilesVersion1;
  }

  getColorCodeByIndex(index) { return getColorCodeByIndex(index); }

  getDoubleDigitTruthfulness(index) {
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
    }
  }

  getTotalObtainedItems() {
    let totalObtainedItems = 0;
    if (this.game && this.game.players  && this.game.players[this.index]) {
      if (this.game.players[this.index].bonusesWon) {
        totalObtainedItems += this.game.players[this.index].bonusesWon.length;
      }
      if (this.game.players[this.index].bottomTierSquaresBought) {
        totalObtainedItems += this.game.players[this.index].bottomTierSquaresBought.length;
      }
      if (this.game.players[this.index].middleTierSquaresBought) {
        totalObtainedItems += this.game.players[this.index].middleTierSquaresBought.length;
      }
      if (this.game.players[this.index].topTierSquaresBought) {
        totalObtainedItems += this.game.players[this.index].topTierSquaresBought.length;
      }
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
      hashtags: 0
    };
  }

  getGenericVictoryTile(): number[] {
    return [3, 3, 3, 0, 0];
  }

  getItemsObtainedArray(): ItemObtained[] {
    const itemsObtained = [];
    if (this.game && this.game.players && this.game.players[this.index]  && this.victoryTiles && this.bottomTierCards && this.middleTierCards && this.topTierCards) {
      if (this.game.players[this.index].bonusesWon) {
        for (let i = 0; i < this.game.players[this.index].bonusesWon.length; i++) {
          itemsObtained.push({
            isBonus: true,
            card: this.getGenericCard(),
            bonus: this.game.players[this.index].bonusesWon[i] === 50 ? [] : this.victoryTiles[this.game.players[this.index].bonusesWon[i]]
          });
        }
      }
      if (this.game.players[this.index].bottomTierSquaresBought && this.game.players[this.index].middleTierSquaresBought && this.game.players[this.index].topTierSquaresBought) {
        const cardsForColor0 = this.getAllObtainedCardsOfACertainColor(0);
        const cardsForColor1 = this.getAllObtainedCardsOfACertainColor(1);
        const cardsForColor2 = this.getAllObtainedCardsOfACertainColor(2);
        const cardsForColor3 = this.getAllObtainedCardsOfACertainColor(3);
        const cardsForColor4 = this.getAllObtainedCardsOfACertainColor(4);
        for (let i = 0; i < cardsForColor0.length; i++) {
          itemsObtained.push({
            isBonus: false,
            card: cardsForColor0[i],
            bonus: this.getGenericVictoryTile()
          });
        }
        for (let i = 0; i < cardsForColor1.length; i++) {
          itemsObtained.push({
            isBonus: false,
            card: cardsForColor1[i],
            bonus: this.getGenericVictoryTile()
          });
        }
        for (let i = 0; i < cardsForColor2.length; i++) {
          itemsObtained.push({
            isBonus: false,
            card: cardsForColor2[i],
            bonus: this.getGenericVictoryTile()
          });
        }
        for (let i = 0; i < cardsForColor3.length; i++) {
          itemsObtained.push({
            isBonus: false,
            card: cardsForColor3[i],
            bonus: this.getGenericVictoryTile()
          });
        }
        for (let i = 0; i < cardsForColor4.length; i++) {
          itemsObtained.push({
            isBonus: false,
            card: cardsForColor4[i],
            bonus: this.getGenericVictoryTile()
          });
        }
      }
    }
    return itemsObtained;
  }

  getAllObtainedCardsOfACertainColor(index): Card[] {
    const cards = [];
    for (let i = 0; i < this.game.players[this.index].topTierSquaresBought.length; i++) {
      if (this.topTierCards[this.game.players[this.index].topTierSquaresBought[i]].color === index) {
        cards.push(this.topTierCards[this.game.players[this.index].topTierSquaresBought[i]]);
      }
    }
    for (let i = 0; i < this.game.players[this.index].middleTierSquaresBought.length; i++) {
      if (this.middleTierCards[this.game.players[this.index].middleTierSquaresBought[i]].color === index) {
        cards.push(this.middleTierCards[this.game.players[this.index].middleTierSquaresBought[i]]);
      }
    }
    for (let i = 0; i < this.game.players[this.index].bottomTierSquaresBought.length; i++) {
      if (this.bottomTierCards[this.game.players[this.index].bottomTierSquaresBought[i]].color === index) {
        cards.push(this.bottomTierCards[this.game.players[this.index].bottomTierSquaresBought[i]]);
      }
    }
    return cards;
  }

  getIndexOfItemToLookAt(index) {
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

  getQuantityOfSecretReservedCards() {
    let numberOfSecretReservedCards
  }

  evaluateIfReservedCardShouldAppear(index) {

  }
}
