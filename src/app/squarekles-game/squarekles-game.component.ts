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

  getCard(tier, slotIndex): Card {
    if (!this.game) {
      return {
        tier,
        color: 3,
        cost: [1, 1, 1, 1, 0],
        pointValue: 0,
        hashtags: 0
      };
    }
    const deck = tier === 'bottom' ? this.bottomTierCards : tier === 'middle' ? this.middleTierCards : this.topTierCards;
    const visibleSquares = tier === 'bottom' ? this.game.bottomTierVisibleSquares : tier === 'middle' ? this.game.middleTierVisibleSquares : this.game.topTierVisibleSquares;
    return deck[visibleSquares[slotIndex]];
  }

  getVictoryTile(index) {
    if (this.victoryTiles && this.game && this.game.unwonBonuses && this.game.unwonBonuses[index] > -1) {
      if (this.game.unwonBonuses[index] === 50) {
        return [];
      }
      return this.victoryTiles[this.game.unwonBonuses[index]];
    }
    return [3, 3, 3, 0, 0];
  }

  isUpperCase(str) {
    return str === str.toUpperCase();
  }

  redirectToAllCaps(identifier) {
    this.router.navigate( ['squarekles/' + identifier]);
  }
}
