import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WebSocketService} from '../web-socket.service';
import {GameStateProviderService} from '../game-state-provider.service';
import {Card} from './interfaces/card';
import {Player} from './interfaces/player';
import {CardLocation} from './enums/card-location';
import {setCardPositions} from '../functions/setCardPositions';
import {BonusTile} from './interfaces/bonus-tile';
import {initializeVictoryTiles} from '../functions/initializeVictoryTiles';
import {SquarekleGame} from './interfaces/squarekle-game';
import {BonusLocation} from './enums/bonus-location';
import {Tiers} from './enums/tiers';

@Component({
  selector: 'app-squarekles-game',
  templateUrl: './squarekles-game.component.html',
  styleUrls: [
    './squarekles-game.component.scss'
  ]
})
export class SquareklesGameComponent implements OnInit {
  CardLocation = CardLocation;
  BonusLocation = BonusLocation;
  Tiers = Tiers;
  identifier: string;
  game: SquarekleGame;

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
    this.gameStateProviderService.getSquareklesState(this.getGenericGameOfVersion(1)).subscribe((game) => {
      this.game = this.getGameFromResponse(game);
    });
    this.listen();
  }

  listen() {
    this.webSocketService.listen('update-squarekles-game').subscribe(response => {
      this.game = this.getGameFromResponse(response);
    });
  }

  getGenericGame(): SquarekleGame {
    const player0 = this.getGenericPlayer(0);
    const player1 = this.getGenericPlayer(1);
    const player2 = this.getGenericPlayer(2);
    const player3 = this.getGenericPlayer(3);
    const cards = this.getGenericCardList();
    const victoryTiles = this.getGenericVictoryTiles();
    return {
      identifier: this.identifier ? this.identifier : 'dontwantthistoexist',
      started: false,
      turn: -1,
      gameVersion: 0,
      mustBuyTopTierSquareToWin: false,
      mustHaveOneSquareOfEachColorToWin: false,
      hashtagMode: false,
      contemplatedCirclesToPutBack: [0, 0, 0, 0, 0, 0],
      contemplatedCirclesToTake: [0, 0, 0, 0, 0],
      cards,
      bonusTiles: victoryTiles,
      players: [
        player0,
        player1,
        player2,
        player3
      ]
    };
  }

  getGenericGameUnfiltered(): SquarekleGame {
    const game = JSON.parse(JSON.stringify(require('../../../resources/squareklesGenericGame.json')));
    game.identifier = this.identifier ? this.identifier : game.identifier;
    return game;
  }

  getGenericGameOfVersion(gameVersion): SquarekleGame {
    const game = this.getGenericGameUnfiltered();
    game.cards = game.cards.filter(x => x.gameVersion === gameVersion);
    game.bonusTiles = game.bonusTiles.filter(x => x.gameVersion === gameVersion);
    if (gameVersion === 1) {
      game.hashtagMode = true;
      game.mustHaveOneSquareOfEachColorToWin = true;
      game.mustBuyTopTierSquareToWin = true;
    }
    return game;
  }

  getGameFromResponse(game): SquarekleGame {
    return new SquarekleGame(game.identifier ? game.identifier : 'dontwantthistoexist',
      !!game.started,
      (game.turn || game.turn === 0) ? game.turn : 0,
      (game.gameVersion || game.gameVersion === 0) ? game.gameVersion : 0,
      !!game.mustBuyTopTierSquareToWin,
      !!game.mustHaveOneSquareOfEachColorToWin,
      !!game.hashtagMode,
      game.contemplatedCirclesToTake ? game.contemplatedCirclesToTake : [0, 0, 0, 0, 0],
      game.contemplatedCirclesToPutBack ? game.contemplatedCirclesToPutBack : [0, 0, 0, 0, 0, 0],
      game.players ? game.players : [this.getGenericPlayer(0), this.getGenericPlayer(1),
        this.getGenericPlayer(2), this.getGenericPlayer(3)],
      game.cards ? game.cards : this.getGenericCardList(),
      game.bonusTiles ? game.bonusTiles : this.getGenericVictoryTiles());
  }

  getGenericPlayer(index: number): Player {
    const playerName = (index + 1).toString();
    return {
      name: 'Player' + playerName + 'name',
      color: index,
      circles: [0, 0, 0, 0, 0, 0, 0]
    };
  }

  getGenericCardList(): Card[] {
    const cardList = JSON.parse(JSON.stringify(require('../../../resources/squareklesCards.json'))).filter(x => x.gameVersion === 0);
    setCardPositions(cardList);
    return cardList;
  }

  getGenericVictoryTiles(): BonusTile[] {
    const victoryTiles = JSON.parse(JSON.stringify(require('../../../resources/squareklesVictoryTiles.json'))).filter(x => x.gameVersion === 0);
    initializeVictoryTiles(victoryTiles, 4, false);
    return victoryTiles;
  }

  getGenericCard(tier, cardLocation): Card {
    return {
      tier,
      color: 3,
      cost: [1, 1, 1, 1, 0],
      pointValue: 0,
      hashtags: 0,
      gameVersion: 0,
      cardLocation
    };
  }

  getGenericVictoryTile(bonusLocation): BonusTile {
    return {
      cost: [3, 3, 3, 0, 0],
      bonusLocation,
      gameVersion: 0,
      otherSideTaken: false
    };
  }

  getCard(tier, cardLocation): Card {
    if (!this.game) {
      return this.getGenericCard(tier, cardLocation);
    }
    const cardsThatMeetCriteria = this.game.cards.filter(x => x.cardLocation === cardLocation);
    if (cardsThatMeetCriteria.length === 0) {
      return this.getGenericCard(tier, cardLocation);
    }
    return cardsThatMeetCriteria[0];
  }

  getVictoryTile(bonusLocation): BonusTile  {
    if (!this.game) {
      return this.getGenericVictoryTile(bonusLocation);
    }
    const bonusesThatMeetCriteria = this.game.bonusTiles.filter(x => x.bonusLocation === bonusLocation);
    if (bonusesThatMeetCriteria.length === 0) {
      return this.getGenericVictoryTile(bonusLocation);
    }
    return  bonusesThatMeetCriteria[0];
  }

  cardExistsAtPositionAndTier(cardLocation: number, tier: string): boolean {
    if (this.game) {
      const cardsMeetingCriteria = this.game.cards.filter(x => x.tier === tier && x.cardLocation === cardLocation);
      if (cardsMeetingCriteria.length > 1) {
        return true;
      }
    }
    return false;
  }

  bonusExistsAtSlot(bonusLocation: number): boolean {
    if (this.game) {
      const bonusesThatMeetCriteria = this.game.bonusTiles.filter(x => x.bonusLocation === bonusLocation);
      if (bonusesThatMeetCriteria.length > 0) {
        return true;
      }
    }
    return false;
  }

  getWhetherPlayerAvatarShouldExist(index) {
    if (this.game && this.game.players && (this.game.players.length > index || index < 2)) {
      return true;
    }
    return false;
  }

  isUpperCase(str) {
    return str === str.toUpperCase();
  }

  redirectToAllCaps(identifier) {
    this.router.navigate( ['squarekles/' + identifier]);
  }

  getPositionOfPlayerAtIndex(index) {
    return index === 3 ? '615px' : index === 2 ? '410px' : index === 1 ? '205px' : '0px';
  }
}
