import {Component, Input, OnInit} from '@angular/core';
import { getColorCodeByIndex } from '../functions/getColorCodeByIndex';
import { getNthElementWithNonZeroValue } from '../functions/getNthElementWithNonZeroValue';
import { getTotalItemsWithNonZeroCost } from '../functions/getTotalItemsWithNonZeroCost';
import { getColorCost } from '../functions/getColorCost';
import { getCostColor } from '../functions/getCostColor';
import {WebSocketService} from '../web-socket.service';
import {TokenQuantity} from '../squarekles-game/enums/token-quantity';
import {Tiers} from "../squarekles-game/enums/tiers";
import {getIntegerRepresentingPlayerCardOwnershipLocation} from "../functions/get-integer-representing-player-card-ownership-location";

@Component({
  selector: 'app-coin-exchange-carrier',
  templateUrl: './coin-exchange-carrier.component.html',
  styleUrls: ['./coin-exchange-carrier.component.scss']
})
export class CoinExchangeCarrierComponent implements OnInit {
  @Input() elementIndex: number;
  @Input() game;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
  }

  getColorCodeByIndex(): string {
    return getColorCodeByIndex(this.elementIndex != null
    && this.elementIndex !== undefined
    && this.elementIndex > -1 ? this.elementIndex : 0);
  }

  minusButtonShouldBeEnabled(index: number): boolean {
    if (this.game && this.game.started) {
      if (this.game.players[this.game.turn].circles[index] + this.game.contemplatedCirclesToTake[index] > 0
        && !this.game.selectABonus) {
        return true;
      }
    }
    return false;
  }

  alreadyTakingTwoOfAKind(): boolean {
    let taking2 = false;
    this.game.contemplatedCirclesToTake.forEach(circle => {
      if (circle >= 2) {
        taking2 = true;
      }
    });
    return taking2;
  }

  getDifferentOnesBeingTaken(): number {
    let positives = 0;
    this.game.contemplatedCirclesToTake.forEach(circle => {
      if (circle > 0) {
        positives++;
      }
    });
    return positives;
  }

  puttingBackWillMakeYouExceedTen(index): boolean {
    if (this.game) {
      const sumOfCircles = this.game.players[this.game.turn].circles.reduce((a, b) => a + b) + this.getQuantityOfTopRowTokens();
      const sumOfContemplatedCircles = this.game.contemplatedCirclesToTake.reduce((a, b) => a + b);
      if (this.game.contemplatedCirclesToTake[index] < 0) {
        return sumOfContemplatedCircles + sumOfCircles + 1 > 10;
      }
    }
    return false;
  }

  tryingToTakeASecondOfOneIndexWhileTakingAnotherIndex(index: number): boolean {
    const positives = this.getDifferentOnesBeingTaken();
    if (positives > 1 && this.game.contemplatedCirclesToTake[index] > 0) {
      return true;
    }
    return false;
  }

  alreadyHaveOneWhileAnotherWouldLeaveLessThan2(index: number): boolean {
    if (this.game.contemplatedCirclesToTake[index] > 0 && this.getTokensRemainingInBankOfACertainColor(this.elementIndex) < 3) {
      return true;
    }
    return false;
  }

  alreadyHaveTen(): boolean {
    return this.game.players[this.game.turn].circles.reduce((accum, curr) => accum + curr) > 9;
  }

  allOut(index: number): boolean {
    return this.getTokensRemainingInBankOfACertainColor(index) + this.game.contemplatedCirclesToTake[index] <= 0;
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
    const ownershipNum = getIntegerRepresentingPlayerCardOwnershipLocation(this.game.turn);
    const quantityOfTopTierCardsOwned = this.game.cards.filter(card => card.tier === Tiers.Top && card.cardLocation === ownershipNum).length;
    return quantityOfTopTierCardsOwned > 0 ? 1 : 0;
  }

  sumOfContemplatedAndCurrentTotalTokensMeetsOrExceedsTen(): boolean {
    if (this.game) {
      const sumOfCircles = this.game.players[this.game.turn].circles.reduce((a, b) => a + b) + this.getQuantityOfTopRowTokens();
      const sumOfContemplatedCircles = this.game.contemplatedCirclesToTake.reduce((a, b) => a + b);
      return sumOfCircles + sumOfContemplatedCircles >= 10;
    }
    return false;
  }

  plusButtonShouldBeEnabled(index: number): boolean {
    if (this.game && this.game.started) {
      if ((!this.alreadyTakingTwoOfAKind()
        && this.getDifferentOnesBeingTaken() < 3
        && !this.tryingToTakeASecondOfOneIndexWhileTakingAnotherIndex(index)
        && !this.alreadyHaveOneWhileAnotherWouldLeaveLessThan2(index)
        && !this.alreadyHaveTen()
        && !this.allOut(index)
        && !this.sumOfContemplatedAndCurrentTotalTokensMeetsOrExceedsTen()
        && !this.game.selectABonus)
        || (this.game.contemplatedCirclesToTake[index] < 0
          && !this.puttingBackWillMakeYouExceedTen(index))) {
        return true;
      }
    }
    return false;
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

  getTokensRemainingInBankOfACertainColor(index: number): number {
    const totalTokens = this.getTotalTokensOfCertainColorInGame();
    let quantityHeldByPlayers = 0;
    if (this.game && this.game.players) {
      this.game.players.forEach((player) => {
        quantityHeldByPlayers += player.circles[index];
      });
    }
    return totalTokens - quantityHeldByPlayers - this.game.contemplatedCirclesToTake[index];
  }

  getQuantityOfCertainTokenColorHeldByPlayers(index: number): number {
    let quantityOfCertainTokenColorHeldByPlayers = 0;
    if (this.game) {
      this.game.players.forEach(player => {
        quantityOfCertainTokenColorHeldByPlayers += player.circles[index];
      });
    }
    return quantityOfCertainTokenColorHeldByPlayers;
  }

  getBankQuantityThatShouldAppear(): number {
    if (this.game && this.game.contemplatedCirclesToTake) {
      if (this.elementIndex === 5) {
        return this.getRemainingRandomTokenNumberThatShouldAppearInBank();
      }
      return this.getTotalTokensOfCertainColorInGame() - this.game.contemplatedCirclesToTake[this.elementIndex]
        - this.getQuantityOfCertainTokenColorHeldByPlayers(this.elementIndex);
    }
    return TokenQuantity.Players4;
  }

  getRemainingRandomTokens(): number {
    let tokensHeldByPlayers = 0;
    if (this.game && this.game.players) {
      this.game.players.forEach(player => {
        tokensHeldByPlayers += player.circles[5];
      });
    }
    return 5 - tokensHeldByPlayers;
  }

  getRemainingRandomTokenNumberThatShouldAppearInBank(): number {
    const remainingRandomTokens = this.getRemainingRandomTokens();
    if (this.game) {
      return  remainingRandomTokens - this.game.contemplatedCirclesToTake[5];
    }
    return remainingRandomTokens;
  }

  changeTokenCount(index: number, plus: boolean): void {
    const game = JSON.parse(JSON.stringify(this.game));
    if (plus) {
      game.contemplatedCirclesToTake[index]++;
    } else {
      game.contemplatedCirclesToTake[index]--;
    }
    this.webSocketService.emit('update-squarekles-game', game);
  }

  plusSignShouldExist() {
    if (this.game) {
      return this.game.contemplatedCirclesToTake[5] < 0 || this.elementIndex !== 5;
    }
    return true;
  }
}
