import {Component, Input, OnInit} from '@angular/core';
import {SquarekleGame} from '../squarekles-game/interfaces/squarekle-game';
import {WebSocketService} from '../web-socket.service';
import {removeBonusAtLocation} from '../functions/remove-bonus-at-location';
import {setBonusAtLocation} from '../functions/set-bonus-at-location';
import {BonusTile} from '../squarekles-game/interfaces/bonus-tile';
import {BonusLocation} from '../squarekles-game/enums/bonus-location';
import {getGenericGameOfVersion} from '../functions/get-generic-game-of-version';
import {setCardAtLocation} from "../functions/set-card-at-location";
import {CardLocation} from "../squarekles-game/enums/card-location";
import {Tiers} from "../squarekles-game/enums/tiers";

@Component({
  selector: 'app-squarekles-menu',
  templateUrl: './squarekles-menu.component.html',
  styleUrls: ['./squarekles-menu.component.scss']
})

export class SquareklesMenuComponent implements OnInit {
  @Input() game: SquarekleGame;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
  }

  removeBonusAtLocation(bonusTiles: BonusTile[], location: number): void { removeBonusAtLocation(bonusTiles, location); }
  setBonusAtLocation(bonusTiles: BonusTile[], location: number, hashtagMode: boolean): void { setBonusAtLocation(bonusTiles, location, hashtagMode); }

  getNextAvailableColor(): number {
    let color = -1;
    let colorToTry = 0;
    while (color === -1) {
      if (!this.someoneElseHasTheColor(colorToTry)) {
        color = colorToTry;
      } else {
        colorToTry++;
      }
    }
    return color;
  }

  someoneElseHasTheColor(colorToTry: number): boolean {
    let someoneElseHasTheColor = false;
    this.game.players.forEach(player => {
      if (player.color === colorToTry) {
        someoneElseHasTheColor = true;
      }
    });
    return someoneElseHasTheColor;
  }

  setGameVersion(gameVersion): void {
    if (this.game) {
      const version = gameVersion === 1 || gameVersion === '1' ? 1 : 0;
      let game = JSON.parse(JSON.stringify(this.game));
      game = getGenericGameOfVersion(version, game.identifier);
      if (game.gameVersion === 0) {
        removeBonusAtLocation(game.bonusTiles, BonusLocation.Slot2);
        setBonusAtLocation(game.bonusTiles, BonusLocation.Slot2, true);
      }
      this.webSocketService.emit('update-squarekles-game', game);
    }
  }

  setNumberOfPlayers(playersNumber): void {
    const game = JSON.parse(JSON.stringify(this.game));
    const playerQuantity = playersNumber === '2' || playersNumber === 2
      ? 2 : playersNumber === '3' || playersNumber === 3 ? 3 : 4;
    const currentNumberOfPlayers = game.players.length;
    if (playerQuantity > currentNumberOfPlayers) {
      for (let i = 0; i < playerQuantity - currentNumberOfPlayers; i++) {
        game.players.push({
          name: `Player${currentNumberOfPlayers + i + 1}Name`,
          color: this.getNextAvailableColor(),
          circles: [0, 0, 0, 0, 0, 0]
        });
        if (currentNumberOfPlayers + i === 2) {
          setBonusAtLocation(game.bonusTiles, BonusLocation.Slot4, game.hashtagMode);
        }
        if (currentNumberOfPlayers + i === 3) {
          setBonusAtLocation(game.bonusTiles, BonusLocation.Slot0, game.hashtagMode);
        }
      }
    }
    if (playerQuantity < currentNumberOfPlayers) {
      removeBonusAtLocation(game.bonusTiles, BonusLocation.Slot0);
      if (playerQuantity === 2) {
        removeBonusAtLocation(game.bonusTiles, BonusLocation.Slot4);
      }
      game.players.splice(playerQuantity, currentNumberOfPlayers - playerQuantity);
    }
    this.webSocketService.emit('update-squarekles-game', game);
  }

  toggleHashtagMode(): void {
    if (this.game) {
      const wasAlreadyInHashtagMode = !!this.game.hashtagMode;
      const game = JSON.parse(JSON.stringify(this.game));
      game.hashtagMode = !wasAlreadyInHashtagMode;
      this.removeBonusAtLocation(game.bonusTiles, BonusLocation.Slot2);
      this.setBonusAtLocation(game.bonusTiles, BonusLocation.Slot2, !wasAlreadyInHashtagMode);
      this.webSocketService.emit('update-squarekles-game', game);
    }
  }

  toggleMustBuyFromTopRowToWin(): void {
    if (this.game) {
      const game = JSON.parse(JSON.stringify(this.game));
      game.mustBuyTopTierSquareToWin = !this.game.mustBuyTopTierSquareToWin;
      this.webSocketService.emit('update-squarekles-game', game);
    }
  }

  toggleMustHaveSquareOfEachColorToWin(): void {
    if (this.game) {
      const game = JSON.parse(JSON.stringify(this.game));
      game.mustHaveOneSquareOfEachColorToWin = !this.game.mustHaveOneSquareOfEachColorToWin;
      this.webSocketService.emit('update-squarekles-game', game);
    }
  }

  startGame() {
    const cards = JSON.parse(JSON.stringify(require('../../../resources/squareklesCards.json')))
      .filter(card => card.gameVersion === this.game.gameVersion);
    const bonusTiles = JSON.parse(JSON.stringify(require('../../../resources/squareklesVictoryTiles.json')))
      .filter(bonusTile => bonusTile.gameVersion === this.game.gameVersion);
    setCardAtLocation(cards, CardLocation.BottomTierSlot0, Tiers.Bottom);
    setCardAtLocation(cards, CardLocation.BottomTierSlot1, Tiers.Bottom);
    setCardAtLocation(cards, CardLocation.BottomTierSlot2, Tiers.Bottom);
    setCardAtLocation(cards, CardLocation.BottomTierSlot3, Tiers.Bottom);
    setCardAtLocation(cards, CardLocation.MiddleTierSlot0, Tiers.Middle);
    setCardAtLocation(cards, CardLocation.MiddleTierSlot1, Tiers.Middle);
    setCardAtLocation(cards, CardLocation.MiddleTierSlot2, Tiers.Middle);
    setCardAtLocation(cards, CardLocation.MiddleTierSlot3, Tiers.Middle);
    setCardAtLocation(cards, CardLocation.TopTierSlot0, Tiers.Top);
    setCardAtLocation(cards, CardLocation.TopTierSlot1, Tiers.Top);
    setCardAtLocation(cards, CardLocation.TopTierSlot2, Tiers.Top);
    setCardAtLocation(cards, CardLocation.TopTierSlot3, Tiers.Top);
    setBonusAtLocation(bonusTiles, BonusLocation.Slot2, this.game.hashtagMode);
    setBonusAtLocation(bonusTiles, BonusLocation.Slot3, this.game.hashtagMode);
    setBonusAtLocation(bonusTiles, BonusLocation.Slot1, this.game.hashtagMode);
    if (this.game.players.length > 2) {
      setBonusAtLocation(bonusTiles, BonusLocation.Slot4, this.game.hashtagMode);
    }
    if (this.game.players.length > 3) {
      setBonusAtLocation(bonusTiles, BonusLocation.Slot0, this.game.hashtagMode);
    }
    const players = JSON.parse(JSON.stringify(this.game.players));
    const game = new SquarekleGame(this.game.identifier, true, 0, this.game.gameVersion,
      this.game.mustBuyTopTierSquareToWin, this.game.mustHaveOneSquareOfEachColorToWin, this.game.hashtagMode,
      [0, 0, 0, 0, 0, 0], false, players, cards, bonusTiles);
    this.webSocketService.emit('update-squarekles-game', game);
  }

}
