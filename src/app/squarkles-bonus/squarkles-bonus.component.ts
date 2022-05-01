import {Component, Input, OnInit} from '@angular/core';
import {Card} from '../squarekles-game/interfaces/card';
import {WebSocketService} from '../web-socket.service';
import { getTotalItemsWithNonZeroCost } from '../functions/getTotalItemsWithNonZeroCost';
import { getColorCost } from '../functions/getColorCost';
import { getCostColor } from '../functions/getCostColor';
import {BonusTile} from '../squarekles-game/interfaces/bonus-tile';
import {hasEnoughForBonus} from '../functions/has-enough-for-bonus';
import {getIntegerRepresentingPlayerBonusTileOwnershipLocation} from '../functions/get-integer-representing-player-bonus-tile-ownership-location';
import {checkIfGameIsOverAndIfSoEvaluateWinner} from '../functions/check-if-game-is-over-and-if-so-evaluate-winner';

@Component({
  selector: 'app-squarkles-bonus',
  templateUrl: './squarkles-bonus.component.html',
  styleUrls: ['./squarkles-bonus.component.scss']
})
export class SquarklesBonusComponent implements OnInit {
  @Input() victoryTile: BonusTile;
  @Input() game;

  constructor(private webSocketService: WebSocketService) { }

  hasEnoughForBonus(playerIndex: number, bonusTile: BonusTile, cards: Card[]): boolean { return hasEnoughForBonus(playerIndex, bonusTile, cards); }

  ngOnInit(): void {
  }
  getCostColor(arr: number[], index: number): string { return getCostColor(arr, index, 3); }
  getColorCost(arr: number[], index: number): number { return getColorCost(arr, index, 3); }
  getTotalItemsWithNonZeroCost(arr: number[]): number { return getTotalItemsWithNonZeroCost(arr); }

  selectButtonShouldAppear(): boolean {
    return this.victoryTile.cost.length > 0 && this.game.selectABonus
      && this.hasEnoughForBonus(this.game.turn, this.victoryTile, this.game.cards);
  }

  selectVictoryTile(): void {
    if (this.game) {
      const game = JSON.parse(JSON.stringify(this.game));
      const tilesAtThisPosition = game.victoryTile.filter(tile => {
        return tile.bonusLocation === this.victoryTile.bonusLocation;
      });
      tilesAtThisPosition[0].bonusLocation = getIntegerRepresentingPlayerBonusTileOwnershipLocation(game.turn);
      game.selectABonus = false;
      const winnersArr = checkIfGameIsOverAndIfSoEvaluateWinner(game);
      if (winnersArr.length > 0) {
        game.started = false;
        game.turn = 0;
      } else {
        game.turn = game.turn === game.players.length - 1 ? 0 : game.turn + 1;
      }
      this.webSocketService.emit('update-squarekles-game', game);
    }
  }

}
