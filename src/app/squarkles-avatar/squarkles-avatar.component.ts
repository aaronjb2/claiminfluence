import {Component, Input, OnInit} from '@angular/core';
import {getColorCodeByIndex} from '../functions/getColorCodeByIndex';
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
import {Tiers} from '../squarekles-game/enums/tiers';
import {getCostInOneTimePurchasePowerOfColor} from '../functions/get-cost-in-one-time-purchase-power-of-color';
import {gainHashtagAward} from "../functions/gain-hashtag-award";
import {getVictoryTilesPlayerQualifiesFor} from "../functions/get-victory-tiles-player-qualifies-for";
import {checkIfGameIsOverAndIfSoEvaluateWinner} from "../functions/check-if-game-is-over-and-if-so-evaluate-winner";

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

  getCostInOneTimePurchasePowerOfColor(colorIndex: number, game: SquarekleGame, reserve: boolean = true, card: Card = {
    color: 0,
    cost: [1, 1, 1, 1, 0],
    tier: Tiers.Bottom,
    gameVersion: 0,
    hashtags: 0,
    pointValue: 0,
    cardLocation: CardLocation.Deck
  }): number {
    return getCostInOneTimePurchasePowerOfColor(colorIndex, game, reserve, card);
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

  getCostNotCoveredByPermanentPurchasingPower(card: Card, colorIndex: number): number {
    if (card.cost[colorIndex] === 0) {
      return 0;
    }
    if (this.game && this.game.cards) {
      const playerOwnershipNum = getIntegerRepresentingPlayerCardOwnershipLocation(this.game.turn);
      const permanentPurchasePowerOfThatColor = this.game.cards.filter((c) => {
        return c.cardLocation === playerOwnershipNum && c.color === colorIndex;
      }).length;
      if (permanentPurchasePowerOfThatColor >= card.cost[colorIndex]) {
        return 0;
      } else {
        return permanentPurchasePowerOfThatColor - card.cost[colorIndex];
      }
    }
  }

  getRandomTokenCost(): number {
    const card = this.getReservedCards()[this.itemBeingDisplayed - 2];
    const notCoveredByPppColor0Cost = this.getCostNotCoveredByPermanentPurchasingPower(card, 0);
    const notCoveredByPppColor1Cost = this.getCostNotCoveredByPermanentPurchasingPower(card, 1);
    const notCoveredByPppColor2Cost = this.getCostNotCoveredByPermanentPurchasingPower(card, 2);
    const notCoveredByPppColor3Cost = this.getCostNotCoveredByPermanentPurchasingPower(card, 3);
    const notCoveredByPppColor4Cost = this.getCostNotCoveredByPermanentPurchasingPower(card, 4);
    const oneTimeCost0 = this.getCostInOneTimePurchasePowerOfGivenColor(notCoveredByPppColor0Cost, 0);
    const oneTimeCost1 = this.getCostInOneTimePurchasePowerOfGivenColor(notCoveredByPppColor1Cost, 1);
    const oneTimeCost2 = this.getCostInOneTimePurchasePowerOfGivenColor(notCoveredByPppColor2Cost, 2);
    const oneTimeCost3 = this.getCostInOneTimePurchasePowerOfGivenColor(notCoveredByPppColor3Cost, 3);
    const oneTimeCost4 = this.getCostInOneTimePurchasePowerOfGivenColor(notCoveredByPppColor4Cost, 4);
    return (oneTimeCost0 - notCoveredByPppColor0Cost >= 0 ? ((oneTimeCost0 - notCoveredByPppColor0Cost) * -1) : 0)
      + (oneTimeCost1 - notCoveredByPppColor1Cost >= 0 ? ((oneTimeCost1 - notCoveredByPppColor1Cost) * -1) : 0)
      + (oneTimeCost2 - notCoveredByPppColor2Cost >= 0 ? ((oneTimeCost2 - notCoveredByPppColor2Cost) * -1) : 0)
      + (oneTimeCost3 - notCoveredByPppColor3Cost >= 0 ? ((oneTimeCost3 - notCoveredByPppColor3Cost) * -1) : 0)
      + (oneTimeCost4 - notCoveredByPppColor4Cost >= 0 ? ((oneTimeCost3 - notCoveredByPppColor4Cost) * -1) : 0);
  }

  getCostInOneTimePurchasePowerOfGivenColor(costNotCoveredByPpp: number, colorIndex: number): number {
    if (costNotCoveredByPpp === 0) {
      return costNotCoveredByPpp;
    }
    if (this.game && this.game.players) {
      return this.game.players[this.game.turn].circles[colorIndex] >= (costNotCoveredByPpp * -1)
        ? costNotCoveredByPpp : (this.game.players[this.game.turn].circles[colorIndex] * -1);
    }
    return 0;
  }

  getOneTimeCostThatShouldAppear(colorIndex: number): number {
    if (this.game) {
      const card = this.getReservedCards()[this.itemBeingDisplayed - 2];
      const costNotCoveredByPpp = this.getCostNotCoveredByPermanentPurchasingPower(card, colorIndex);
      const selfAfflictedAdditionalDamage = this.game.contemplatedCirclesToTake[colorIndex] < 0
        ? this.game.contemplatedCirclesToTake[colorIndex] : 0;
      if (colorIndex === 5) {
        return this.getRandomTokenCost() + selfAfflictedAdditionalDamage;
      }
      if (costNotCoveredByPpp >= 0) {
        return selfAfflictedAdditionalDamage;
      }
      if (this.game.players[this.game.turn].circles[colorIndex] >= (costNotCoveredByPpp * -1)) {
        return costNotCoveredByPpp + selfAfflictedAdditionalDamage;
      }
      return (this.game.players[this.game.turn].circles[colorIndex] * -1) + selfAfflictedAdditionalDamage;
    }
    return 0;
  }

  allCostsAreZero(): boolean {
    for (let i = 0; i < 6; i++) {
      if (this.getOneTimeCostThatShouldAppear(i) !== 0) {
        return false;
      }
    }
    return true;
  }

  itIsPlayerTurnSoConfirmPurchaseCanStay(): boolean {
    if (this.game) {
      if (this.index !== this.game.turn) {
        if (this.itemBeingDisplayed !== 0 && this.itemBeingDisplayed !== 1) {
          if (this.itemBeingDisplayed === 2 || this.itemBeingDisplayed === 3 || this.itemBeingDisplayed === 4) {
            this.itemBeingDisplayed = 1;
            return false;
          }
        }
      }
    }
    return true;
  }

  confirmPurchase(): void {
    if (this.game) {
      const card = this.getReservedCards()[this.itemBeingDisplayed - 2];
      const game = JSON.parse(JSON.stringify(this.game));
      const filteredCards = game.cards.filter(gameCard => {
        return card.gameVersion === card.gameVersion
          && gameCard.cost[0] === card.cost[0]
          && gameCard.cost[1] === card.cost[1]
          && gameCard.cost[2] === card.cost[2]
          && gameCard.cost[3] === card.cost[3]
          && gameCard.cost[4] === card.cost[4]
          && gameCard.cardLocation === card.cardLocation
          && gameCard.hashtags === card.hashtags
          && gameCard.tier === card.tier
          && gameCard.color === card.color
          && gameCard.pointValue === card.pointValue;
      });
      if (filteredCards.length >= 0) {
        filteredCards[0].cardLocation = getIntegerRepresentingPlayerCardOwnershipLocation(this.game.turn);
        game.players[this.game.turn].circles[0] += this.getCostInOneTimePurchasePowerOfColor(0, this.game, false, card);
        game.players[this.game.turn].circles[1] += this.getCostInOneTimePurchasePowerOfColor(1, this.game, false, card);
        game.players[this.game.turn].circles[2] += this.getCostInOneTimePurchasePowerOfColor(2, this.game, false, card);
        game.players[this.game.turn].circles[3] += this.getCostInOneTimePurchasePowerOfColor(3, this.game, false, card);
        game.players[this.game.turn].circles[4] += this.getCostInOneTimePurchasePowerOfColor(4, this.game, false, card);
        game.players[this.game.turn].circles[5] += this.getCostInOneTimePurchasePowerOfColor(5, this.game, false, card);
        game.contemplatedCirclesToTake = [0, 0, 0, 0, 0, 0];
        const bonusOwnershipNum = getIntegerRepresentingPlayerBonusTileOwnershipLocation(game.turn);
        if (gainHashtagAward(game)) {
          const bonusTile = game.bonusTiles.filter(tile => tile.cost.length === 0);
          bonusTile[0].bonusLocation = bonusOwnershipNum;
        }
        const victoryTilesQualifiedFor = getVictoryTilesPlayerQualifiesFor(game);
        if (victoryTilesQualifiedFor.length > 1) {
          game.selectABonus = true;
        } else {
          if (victoryTilesQualifiedFor.length === 1) {
            const slotNum = victoryTilesQualifiedFor[0] === 0 ? BonusLocation.Slot0
              : victoryTilesQualifiedFor[0] === 1 ? BonusLocation.Slot1
                : victoryTilesQualifiedFor[0] === 2 ? BonusLocation.Slot2
                  : victoryTilesQualifiedFor[0] === 3 ? BonusLocation.Slot3 : BonusLocation.Slot4;
            const tilesAtThisSpot = game.bonusTiles.filter(tile => tile.bonusLocation === slotNum);
            if (tilesAtThisSpot.length > 0) {
              tilesAtThisSpot[0].bonusLocation = bonusOwnershipNum;
            }
          }
          const winningPlayers = checkIfGameIsOverAndIfSoEvaluateWinner(game);
          if (winningPlayers.length > 0) {
            game.started = false;
            game.turn = 0;
          } else {
            game.turn = game.turn < game.players.length - 1 ? game.turn + 1 : 0;
          }
        }
        this.webSocketService.emit('update-squarekles-game', game);
      }
    }
    this.itemBeingDisplayed = -1;
  }
}
