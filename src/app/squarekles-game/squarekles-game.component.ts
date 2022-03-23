import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WebSocketService} from '../web-socket.service';
import {GameStateProviderService} from '../game-state-provider.service';
import {Card} from './interfaces/card';
const resourceCardsBottomTierVersion1 = require('../../../resources/resourceCardsBottomTierVersion1.json');
const resourceCardsBottomTierVersion2 = require('../../../resources/resourceCardsBottomTierVersion2.json');
const resourceCardsMiddleTierVersion1 = require('../../../resources/resourceCardsMiddleTierVersion1.json');
const resourceCardsMiddleTierVersion2 = require('../../../resources/resourceCardsMiddleTierVersion2.json');
const resourceCardsTopTierVersion1 = require('../../../resources/resourceCardsTopTierVersion1.json');
const resourceCardsTopTierVersion2 = require('../../../resources/resourceCardsTopTierVersion2.json');
const victoryTilesVersion1 = require('../../../resources/victoryTilesVersion1.json');
const victoryTilesVersion2 = require('../../../resources/victoryTilesVersion2.json');

@Component({
  selector: 'app-squarekles-game',
  templateUrl: './squarekles-game.component.html',
  styleUrls: [
    './squarekles-game.component.scss'
  ]
})
export class SquareklesGameComponent implements OnInit {
  identifier: string;
  bottomTierCards: Card[];
  middleTierCards: Card[];
  topTierCards: Card[];
  victoryTiles: object[];
  game;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private webSocketService: WebSocketService,
              private gameStateProviderService: GameStateProviderService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.identifier = params.get('identifier');
      if (!this.isUpperCase(this.identifier)) {
        const capitalizedIdentifier = this.identifier.toUpperCase();
        this.redirectToAllCaps(capitalizedIdentifier);
      }
    });
    this.webSocketService.emit('join-squarekles-identifier', this.identifier);
    this.gameStateProviderService.getSquareklesState(this.identifier).subscribe((game) => {
      this.game = game;
      this.updateVariables();
    });
    this.listen();
  }

  listen() {
    this.webSocketService.listen('update-squarekles-game').subscribe(response => {
      this.game = response;
      this.updateVariables();
    });
  }

  updateVariables() {
    this.bottomTierCards = this.game.gameVersion && this.game.gameVersion === 1 ? resourceCardsBottomTierVersion2 : resourceCardsBottomTierVersion1;
    this.middleTierCards = this.game.gameVersion && this.game.gameVersion === 1 ? resourceCardsMiddleTierVersion2 : resourceCardsMiddleTierVersion1;
    this.topTierCards = this.game.gameVersion && this.game.gameVersion === 1 ? resourceCardsTopTierVersion2 : resourceCardsTopTierVersion1;
    this.victoryTiles = this.game.gameVersion && this.game.gameVersion === 1 ? victoryTilesVersion2 : victoryTilesVersion1;
  }

  getSquareTotalColorsWithNonZeroCost(arr) {
    let squareTotalColorsWithNonZeroCost = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > 0) {
        squareTotalColorsWithNonZeroCost++;
      }
    }
    return squareTotalColorsWithNonZeroCost;
  }

  getVictoryTile(unwonBonusIndex, costIndex)
  {
    return this.victoryTiles[this.game.unwonBonuses[unwonBonusIndex]];
  }

  getCard(tier, slotIndex): Card {
    if (!this.game) {
      return {
        color: 'red',
        cost: [1, 1, 1, 1, 0],
        pointValue: 0,
        hashtags: 0
      };
    }
    const deck = tier === 'bottom' ? this.bottomTierCards : tier === 'middle' ? this.middleTierCards : this.topTierCards;
    const visibleSquares = tier === 'bottom' ? this.game.bottomTierVisibleSquares : tier === 'middle' ? this.game.middleTierVisibleSquares : this.game.topTierVisibleSquares;
    return deck[visibleSquares[slotIndex]];
  }

  getCostThatShouldAppearAtSquare(unwonBonusIndex, costIndex)
  {
    const victoryTile = this.getVictoryTile(unwonBonusIndex, costIndex);
    const squareTotalColorsWithNonZeroCost = this.getSquareTotalColorsWithNonZeroCost(victoryTile);
    const adjustedCostIndex = squareTotalColorsWithNonZeroCost > 3 ? costIndex + 1 : squareTotalColorsWithNonZeroCost > 2 ? costIndex : costIndex - 1;
    const indexOfNthNonzeroItem = this.getIndexOfTheIndexThNonZeroItem(victoryTile, adjustedCostIndex);
    return victoryTile[indexOfNthNonzeroItem];
  }

  isUpperCase(str) {
    return str === str.toUpperCase();
  }

  redirectToAllCaps(identifier) {
    this.router.navigate( ['squarekles/' + identifier]);
  }

  getCurrencyBackgroundColor(unwonBonusIndex, costIndex) {
    const victoryTile = this.getVictoryTile(unwonBonusIndex, costIndex);
    const squareTotalColorsWithNonZeroCost = this.getSquareTotalColorsWithNonZeroCost(victoryTile);
    const adjustedCostIndex = squareTotalColorsWithNonZeroCost > 3 ? costIndex + 1 : squareTotalColorsWithNonZeroCost > 2 ? costIndex : costIndex - 1;
    const indexOfNthNonZeroItem = this.getIndexOfTheIndexThNonZeroItem(victoryTile, adjustedCostIndex);
    return this.getCurrencyColor(indexOfNthNonZeroItem);
  }

  getCircleCostBackgroundColor(tier, slotIndex, costIndex) {
    const cardCost = this.getCard(tier, slotIndex).cost;
    const totalCirclesWithNonZeroCost = this.getSquareTotalColorsWithNonZeroCost(cardCost);
    const adjustedCostIndex = totalCirclesWithNonZeroCost > 3 ? costIndex : totalCirclesWithNonZeroCost > 2 ? costIndex - 1
      : totalCirclesWithNonZeroCost > 1 ? costIndex - 2 : costIndex - 3;
    const indexOfNthNonZeroItem = this.getIndexOfTheIndexThNonZeroItem(cardCost, adjustedCostIndex);
    return this.getCurrencyColor(indexOfNthNonZeroItem);
  }

  getCircleCost(tier, slotIndex, costIndex) {
    const cardCost = this.getCard(tier, slotIndex).cost;
    const totalCirclesWithNonZeroCost = this.getSquareTotalColorsWithNonZeroCost(cardCost);
    const adjustedCostIndex = totalCirclesWithNonZeroCost > 3 ? costIndex : totalCirclesWithNonZeroCost > 2 ? costIndex - 1
      : totalCirclesWithNonZeroCost > 1 ? costIndex - 2 : costIndex - 3;
    const indexOfNthNonZeroItem = this.getIndexOfTheIndexThNonZeroItem(cardCost, adjustedCostIndex);
    return cardCost[indexOfNthNonZeroItem];
  }

  getIndexOfTheIndexThNonZeroItem(cardCost, index) {
    const thingsThatAreNotZero = this.getAllIndexesOfThingsThatAreNotZero(cardCost);
    if (index > thingsThatAreNotZero.length - 1) {
      return 4;
    }
    return thingsThatAreNotZero[index];
  }

  getAllIndexesOfThingsThatAreNotZero(arr) {
    const thingsThatAreNotZero = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        thingsThatAreNotZero.push(i);
      }
    }
    return thingsThatAreNotZero;
  }

  getCurrencyColor(index) {
    return [
      '#f5f558',
      '#38fedc',
      '#51ed3b',
      '#c51111',
      '#6a2fb9'
    ][index];
  }
}
