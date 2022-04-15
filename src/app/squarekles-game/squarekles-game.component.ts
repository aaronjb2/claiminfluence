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
import {getIntegerRepresentingPlayerCardKnownReservedLocation} from '../functions/get-integer-representing-player-card-known-reserved-location';
import {getIntegerRepresentingPlayerCardOwnershipLocation} from '../functions/get-integer-representing-player-card-ownership-location';
import {getIntegerRepresentingPlayerCardSecretReservedLocation} from '../functions/get-integer-representing-player-card-secret-reserved-location';
import {getIntegerRepresentingPlayerBonusTileOwnershipLocation} from '../functions/get-integer-representing-player-bonus-tile-ownership-location';
import {getColorCodeByIndex} from '../functions/getColorCodeByIndex';
import {TokenQuantity} from './enums/token-quantity';
import {ItemBeingDisplayed} from './enums/item-being-displayed';

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
  ItemBeingDisplayed = ItemBeingDisplayed;
  Tiers = Tiers;
  identifier: string;
  game: SquarekleGame;
  itemBeingDisplayed: number = -1;

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

  getColorCodeByIndex(index: number): string { return getColorCodeByIndex(index); }
  getIntegerRepresentingPlayerCardKnownReservedLocation(index: number): number { return getIntegerRepresentingPlayerCardKnownReservedLocation(index); }
  getIntegerRepresentingPlayerCardSecretReservedLocation(index: number): number { return getIntegerRepresentingPlayerCardSecretReservedLocation(index); }
  getIntegerRepresentingPlayerCardOwnershipLocation(index: number): number { return getIntegerRepresentingPlayerCardOwnershipLocation(index); }
  getIntegerRepresentingPlayerBonusTileOwnershipLocation(index: number): number { return getIntegerRepresentingPlayerBonusTileOwnershipLocation(index); }

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
      turn: 0,
      gameVersion: 0,
      mustBuyTopTierSquareToWin: false,
      mustHaveOneSquareOfEachColorToWin: false,
      hashtagMode: false,
      selectABonus: false,
      contemplatedCirclesToTake: [0, 0, 0, 0, 0, 0],
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
      game.contemplatedCirclesToTake ? game.contemplatedCirclesToTake : [0, 0, 0, 0, 0, 0],
      !!game.selectABonus,
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
      circles: [0, 0, 0, 0, 0, 0]
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

  getWhetherPlayerAvatarShouldExist(index: number): boolean {
    if (this.game && this.game.players && (this.game.players.length > index || index < 2)) {
      return true;
    }
    return false;
  }

  isUpperCase(str: string): boolean {
    return str === str.toUpperCase();
  }

  redirectToAllCaps(identifier: string): void {
    this.router.navigate( ['squarekles/' + identifier]);
  }

  getPositionOfPlayerAtIndex(index: number): string {
    return index === 3 ? '615px' : index === 2 ? '410px' : index === 1 ? '205px' : '0px';
  }

  getQuantityOfTopRowTokens(index: number): number {
    if (!this.game) {
      return 0;
    }
    if (!this.game.mustBuyTopTierSquareToWin) {
      return 0;
    }
    if (!this.game.cards) {
      return 0;
    }
    const ownershipNum = getIntegerRepresentingPlayerCardOwnershipLocation(index);
    const quantityOfTopTierCardsOwned = this.game.cards.filter(card => card.tier === Tiers.Top && card.cardLocation === ownershipNum).length;
    return quantityOfTopTierCardsOwned > 0 ? 1 : 0;
  }

  getRemainingRandomTokens(): number {
    let remaining = 5;
    if (this.game && this.game.players) {
      this.game.players.forEach(player => {
        remaining -= player.circles[5];
      });
    }
    return remaining;
  }

  getReservedCardsForPlayer(index): number {
    let reservedCards = 0;
    if (this.game) {
      const reservedKnownNum = getIntegerRepresentingPlayerCardKnownReservedLocation(index);
      const reservedSecretNum = getIntegerRepresentingPlayerCardSecretReservedLocation(index);
      reservedCards = this.game.cards.filter(card => {
        return card.cardLocation === reservedKnownNum || card.cardLocation === reservedSecretNum;
      }).length;
    }
    return reservedCards;
  }

  getTotalTokensOfCertainColorInGame(): number {
    if (this.game && this.game.players) {
      if (this.game.players.length === 2) {
        return TokenQuantity.Players2;
      }
      if (this.game.players.length === 3) {{
        return TokenQuantity.Players3;
      }}
    }
    return TokenQuantity.Players4;
  }

  getBankQuantity(index: number): number {
    if (this.game && this.game.contemplatedCirclesToTake) {
      if (index === 5) {
        return this.getRemainingRandomTokens();
      }
      return this.getTotalTokensOfCertainColorInGame();
    }
    return TokenQuantity.Players4;
  }

  thereExistsFourOfAColorThatCanBeTaken(): boolean {
    let thereExistsFourOfAColor = false;
    if (this.game) {
      for (let i = 0; i < 5; i++) {
        if (this.getBankQuantity(i) > 3) {
          thereExistsFourOfAColor = true;
        }
      }
    }
    return thereExistsFourOfAColor;
  }

  getColorsWithMoreThanZeroInBank(): number {
    let colorsWithMoreThanZeroInBank = 0;
    if (this.game) {
      for (let i = 0; i < 5; i++) {
        if (this.getBankQuantity(i) > 0) {
          colorsWithMoreThanZeroInBank++;
        }
      }
    }
    return colorsWithMoreThanZeroInBank;
  }

  getTotalContemplatedTokens(): number {
    let totalContemplatedTokens = 0;
    if (this.game && this.game.contemplatedCirclesToTake) {
      this.game.contemplatedCirclesToTake.forEach(circle => {
        if (circle > 0) {
          totalContemplatedTokens++;
        }
      });
    }
    return totalContemplatedTokens;
  }

  contemplatingTakingMoreThanOneOfACertainColor(): boolean {
    let contemplatingTakingMoreThanOneOfACertainColor = false;
    if (this.game && this.game.contemplatedCirclesToTake) {
      this.game.contemplatedCirclesToTake.forEach(circle => {
        if (circle > 1) {
          contemplatingTakingMoreThanOneOfACertainColor = true;
        }
      });
    }
    return contemplatingTakingMoreThanOneOfACertainColor;
  }

  thereExistsColorThatYouAreNotCurrentlyTakingWithMoreThanZeroAvailable(): boolean {
    let thereExistsColorThatYouAreNotCurrentlyTakingWithMoreThanZeroAvailable = false;
    if (this.game && this.game.contemplatedCirclesToTake) {
      for (let i = 0; i < 5; i++) {
        if (this.game.contemplatedCirclesToTake[i] === 0 && this.getBankQuantity(i) > 0) {
          thereExistsColorThatYouAreNotCurrentlyTakingWithMoreThanZeroAvailable = true;
        }
      }
    }
    return thereExistsColorThatYouAreNotCurrentlyTakingWithMoreThanZeroAvailable;
  }

  getMessage(): string {
    let message = '';
    if (this.game) {
      const remainingRandomTokens = this.getRemainingRandomTokens();
      const reservedCardsForPlayer = this.getReservedCardsForPlayer(this.game.turn);
      const quantityOfTopRowTokens = this.getQuantityOfTopRowTokens(this.game.turn);
      const currentTotalTokensForPlayer = this.game.players[this.game.turn].circles.reduce(
        (a, b) => a + b) + quantityOfTopRowTokens;
      message = 'Buy Something, Reserve Something, Take Tokens, or just end your turn';
      if (currentTotalTokensForPlayer === 9
        && remainingRandomTokens > 0
        && reservedCardsForPlayer < 3) {
        message = 'If you don\'t buy, You might want to reserve a card and get 1 random token';
      } else if (currentTotalTokensForPlayer === 8 && this.thereExistsFourOfAColorThatCanBeTaken()
        && this.getColorsWithMoreThanZeroInBank() > 2) {
        message = 'You cannot collect 3 total tokens this turn without putting at least 1 back';
      } else if (currentTotalTokensForPlayer > 9) {
        message = 'You are at your token limit of 10.  You need to put back to take more.  ';
        if (reservedCardsForPlayer < 3 && remainingRandomTokens > 0) {
          message = 'If you wish to reserve, put a token back first or you can\'t get a random token to go with your reserved card';
        }
      } else if (currentTotalTokensForPlayer < 8 && !this.contemplatingTakingMoreThanOneOfACertainColor()
      && this.getTotalContemplatedTokens() < 3 && this.getTotalContemplatedTokens() > 0
        && this.thereExistsColorThatYouAreNotCurrentlyTakingWithMoreThanZeroAvailable()) {
        message = 'You can still take more before ending your turn';
      } else if (this.getTotalContemplatedTokens() > 2 || this.contemplatingTakingMoreThanOneOfACertainColor()) {
        message = 'If you are satisfied with your selection, click Make Selection';
      }
    }
    return message;
  }

  setItemBeingDisplayed(itemBeingDisplayed) {
    this.itemBeingDisplayed = itemBeingDisplayed;
  }

  confirmTokenTaking(): void {
    if (this.game) {
      const game = JSON.parse(JSON.stringify(this.game));
      this.setItemBeingDisplayed(-1);
      for (let i = 0; i < 6; i++) {
        game.players[game.turn].circles[i] += game.contemplatedCirclesToTake[i];
        game.contemplatedCirclesToTake[i] = 0;
      }
      game.turn = game.turn < game.players.length - 1 ? game.turn + 1 : 0;
      this.webSocketService.emit('update-squarekles-game', game);
    }
  }
}
