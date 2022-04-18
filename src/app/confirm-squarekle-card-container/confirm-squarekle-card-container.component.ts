import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SquarekleGame} from '../squarekles-game/interfaces/squarekle-game';
import {Card} from '../squarekles-game/interfaces/card';
import {Tiers} from '../squarekles-game/enums/tiers';
import {CardLocation} from '../squarekles-game/enums/card-location';
import {ItemBeingDisplayed} from '../squarekles-game/enums/item-being-displayed';
import {getColorCodeByIndex} from '../functions/getColorCodeByIndex';
import {getIntegerRepresentingPlayerCardOwnershipLocation} from '../functions/get-integer-representing-player-card-ownership-location';
import {getIntegerRepresentingPlayerCardKnownReservedLocation} from '../functions/get-integer-representing-player-card-known-reserved-location';
import {getIntegerRepresentingPlayerCardSecretReservedLocation} from '../functions/get-integer-representing-player-card-secret-reserved-location';
import {WebSocketService} from '../web-socket.service';
import {randomNumber} from '../functions/randomNumber';


@Component({
  selector: 'app-confirm-squarekle-card-container',
  templateUrl: './confirm-squarekle-card-container.component.html',
  styleUrls: ['./confirm-squarekle-card-container.component.scss']
})
export class ConfirmSquarekleCardContainerComponent implements OnInit {
  @Input() game: SquarekleGame;
  @Input() itemBeingDisplayed: number;
  @Output() getItemBeingDisplayedChange = new EventEmitter<number>();

  ItemBeingDisplayed = ItemBeingDisplayed;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
  }

  getColorCodeByIndex(index: number): string { return getColorCodeByIndex(index); }

  setItemBeingDisplayed(item: number): void {
    this.getItemBeingDisplayedChange.emit(item);
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

  getCardThatShouldAppear(): Card {
    let cardLocation = CardLocation.Deck;
    if (this.game && this.itemBeingDisplayed !== undefined && this.itemBeingDisplayed !== null) {
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedTopTierCard0
        || this.itemBeingDisplayed === ItemBeingDisplayed.PurchaseTopTierCard0) {
        cardLocation = CardLocation.TopTierSlot0;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedTopTierCard1
        || this.itemBeingDisplayed === ItemBeingDisplayed.PurchaseTopTierCard1) {
        cardLocation = CardLocation.TopTierSlot1;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedTopTierCard2
        || this.itemBeingDisplayed === ItemBeingDisplayed.PurchaseTopTierCard2) {
        cardLocation = CardLocation.TopTierSlot2;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedTopTierCard3
        || this.itemBeingDisplayed === ItemBeingDisplayed.PurchaseTopTierCard3) {
        cardLocation = CardLocation.TopTierSlot3;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedMiddleTierCard0
        || this.itemBeingDisplayed === ItemBeingDisplayed.PurchaseMiddleTierCard0) {
        cardLocation = CardLocation.MiddleTierSlot0;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedMiddleTierCard1
        || this.itemBeingDisplayed === ItemBeingDisplayed.PurchaseMiddleTierCard1) {
        cardLocation = CardLocation.MiddleTierSlot1;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedMiddleTierCard2
        || this.itemBeingDisplayed === ItemBeingDisplayed.PurchaseMiddleTierCard2) {
        cardLocation = CardLocation.MiddleTierSlot2;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedMiddleTierCard3
        || this.itemBeingDisplayed === ItemBeingDisplayed.PurchaseMiddleTierCard3) {
        cardLocation = CardLocation.MiddleTierSlot3;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedBottomTierCard0
        || this.itemBeingDisplayed === ItemBeingDisplayed.PurchaseBottomTierCard0) {
        cardLocation = CardLocation.BottomTierSlot0;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedBottomTierCard1
        || this.itemBeingDisplayed === ItemBeingDisplayed.PurchaseBottomTierCard1) {
        cardLocation = CardLocation.BottomTierSlot1;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedBottomTierCard2
        || this.itemBeingDisplayed === ItemBeingDisplayed.PurchaseBottomTierCard2) {
        cardLocation = CardLocation.BottomTierSlot2;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedBottomTierCard3
        || this.itemBeingDisplayed === ItemBeingDisplayed.PurchaseBottomTierCard3) {
        cardLocation = CardLocation.BottomTierSlot3;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedTopTierUnknownCard) {
        return {
          tier: Tiers.Top,
          cost: [1, 1, 1, 1, 1],
          color: 0,
          hashtags: 0,
          gameVersion: this.game.gameVersion === 1 ? this.game.gameVersion : 0,
          pointValue: 0,
          cardLocation: CardLocation.Deck
        };
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedMiddleTierUnknownCard) {
        return {
          tier: Tiers.Middle,
          cost: [1, 1, 1, 1, 1],
          color: 0,
          hashtags: 0,
          gameVersion: this.game.gameVersion === 1 ? this.game.gameVersion : 0,
          pointValue: 0,
          cardLocation: CardLocation.Deck
        };
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedBottomTierUnknownCard) {
        return {
          tier: Tiers.Bottom,
          cost: [1, 1, 1, 1, 1],
          color: 0,
          hashtags: 0,
          gameVersion: this.game.gameVersion === 1 ? this.game.gameVersion : 0,
          pointValue: 0,
          cardLocation: CardLocation.Deck
        };
      }
      const filteredCards = this.game.cards.filter(card => {
        return card.cardLocation === cardLocation;
      });
      return filteredCards[0];
    }
    return this.getGenericCard(Tiers.Bottom, cardLocation);
  }

  getRemainingRandomTokens(): number {
    let tokensHeldByPlayers = 0;
    if (this.game && this.game.players) {
      this.game.players.forEach(player => {
        tokensHeldByPlayers += player.circles[5];
      });
    }
    return tokensHeldByPlayers - 5;
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

  getTotalTokensHeldByPlayer(): number {
    if (this.game && this.game.players) {
      return this.game.players[this.game.turn].circles.reduce((a, b) => a + b) + this.getQuantityOfTopRowTokens();
    }
    return 0;
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

  thisIsAReserveNotAPurchase(): boolean {
    return this.itemBeingDisplayed >= ItemBeingDisplayed.ReservedTopTierUnknownCard
      && this.itemBeingDisplayed <= ItemBeingDisplayed.ReservedBottomTierCard3;
  }

  getCostInOneTimePurchasePowerOfGivenColor(costNotCoveredByPpp: number, colorIndex: number): number {
    if (costNotCoveredByPpp === 0) {
      return costNotCoveredByPpp;
    }
    if (this.thisIsAReserveNotAPurchase() && colorIndex !== 5 && this.game.contemplatedCirclesToTake[colorIndex] >= 0) {
      return 0;
    }
    if (this.thisIsAReserveNotAPurchase() && colorIndex !== 5 && this.game.contemplatedCirclesToTake[colorIndex] < 0) {
      console.log('in here');
      console.log('returning: ', this.game.contemplatedCirclesToTake[colorIndex]);
      return this.game.contemplatedCirclesToTake[colorIndex];
    }
    if (this.game && this.game.players) {
      return this.game.players[this.game.turn].circles[colorIndex] >= (costNotCoveredByPpp * -1)
        ? costNotCoveredByPpp : (this.game.players[this.game.turn].circles[colorIndex] * -1);
    }
    return 0;
  }

  getOneTimeCostThatShouldAppear(colorIndex: number): number {
    if (this.game) {
      if (this.thisIsAReserveNotAPurchase()) {
        if (this.game.contemplatedCirclesToTake[colorIndex] < 0) {
          return this.game.contemplatedCirclesToTake[colorIndex];
        }
        if (colorIndex !== 5) {
          return 0;
        }
        if (this.randomTokensAreOut()) {
          return 0;
        }
        if (this.game.contemplatedCirclesToTake.reduce((a, b) => a + b)
          + this.game.players[this.game.turn].circles.reduce((a, b) => a + b) + this.getQuantityOfTopRowTokens() >= 10) {
          return 0;
        }
        return 1;
      }
      const card = this.getCardThatShouldAppear();
      const costNotCoveredByPpp = this.getCostNotCoveredByPermanentPurchasingPower(card, colorIndex);
      const selfAfflictedAdditionalDamage = this.game.contemplatedCirclesToTake[colorIndex] < 0
        ? this.game.contemplatedCirclesToTake[colorIndex] : 0;
      if (colorIndex === 5) {
        return this.getRandomTokenCost() + selfAfflictedAdditionalDamage;
      }
      if ((costNotCoveredByPpp * -1) <= 0) {
        return selfAfflictedAdditionalDamage;
      }
      if (this.game.players[this.game.turn].circles[colorIndex] >= (costNotCoveredByPpp * -1)) {
        return costNotCoveredByPpp + selfAfflictedAdditionalDamage;
      }
      return this.game.players[this.game.turn].circles[colorIndex] + selfAfflictedAdditionalDamage;
    }
    return 0;
  }

  randomTokensAreOut(): boolean {
    return this.getRemainingRandomTokens() === 0;
  }

  puttingBackRandomTokens(): boolean {
    if (this.game) {
      return this.game.contemplatedCirclesToTake[5] < 0;
    }
    return false;
  }

  allCostsAreZero(): boolean {
    // const card = this.getCardThatShouldAppear();
    for (let i = 0; i < 6; i++) {
      if (this.getOneTimeCostThatShouldAppear(i) !== 0) {
        return false;
      }
    }
    return true;
    // if (this.getCostInOneTimePurchasePowerOfGivenColor(
    //   this.getCostNotCoveredByPermanentPurchasingPower(card, 0), 0) !== 0) {
    //   return false;
    // }
    // if (this.getCostInOneTimePurchasePowerOfGivenColor(
    //   this.getCostNotCoveredByPermanentPurchasingPower(card, 1), 1) !== 0) {
    //   return false;
    // }
    // if (this.getCostInOneTimePurchasePowerOfGivenColor(
    //   this.getCostNotCoveredByPermanentPurchasingPower(card, 2), 2) !== 0) {
    //   return false;
    // }
    // if (this.getCostInOneTimePurchasePowerOfGivenColor(
    //   this.getCostNotCoveredByPermanentPurchasingPower(card, 3), 3) !== 0) {
    //   return false;
    // }
    // if (this.getCostInOneTimePurchasePowerOfGivenColor(
    //   this.getCostNotCoveredByPermanentPurchasingPower(card, 4), 4) !== 0) {
    //   return false;
    // }
    // if (this.getRandomTokenCost() !== 0) {
    //   return false;
    // }
    // return true;
  }

  getRandomTokenCost(): number {
    if (this.itemBeingDisplayed >= ItemBeingDisplayed.ReservedTopTierUnknownCard
      && this.itemBeingDisplayed <= ItemBeingDisplayed.ReservedBottomTierCard3) {
      if (this.getRemainingRandomTokens() === 0) {
        return 0;
      }
      if (this.getTotalTokensHeldByPlayer() + this.getQuantityOfTopRowTokens()
        + this.game.contemplatedCirclesToTake.reduce((a, b) => a + b) >= 10) {
        return 0;
      }
      return 1;
    } else if (this.itemBeingDisplayed >= ItemBeingDisplayed.ReservedTopTierCard0
      && this.itemBeingDisplayed <= ItemBeingDisplayed.PurchaseBottomTierCard3) {
      const card = this.getCardThatShouldAppear();
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
      return (oneTimeCost0 - notCoveredByPppColor0Cost < 0 ? oneTimeCost0 - notCoveredByPppColor0Cost : 0)
        + (oneTimeCost1 - notCoveredByPppColor1Cost < 0 ? oneTimeCost1 - notCoveredByPppColor1Cost : 0)
        + (oneTimeCost2 - notCoveredByPppColor2Cost < 0 ? oneTimeCost2 - notCoveredByPppColor2Cost : 0)
        + (oneTimeCost3 - notCoveredByPppColor3Cost < 0 ? oneTimeCost3 - notCoveredByPppColor3Cost : 0)
        + (oneTimeCost4 - notCoveredByPppColor4Cost < 0 ? oneTimeCost3 - notCoveredByPppColor4Cost : 0);
    }
    return 0;
  }

  getTier(cardLocation: number): string {
    if (cardLocation === CardLocation.TopTierSlot0
      || cardLocation === CardLocation.TopTierSlot1
      || cardLocation === CardLocation.TopTierSlot2
      || cardLocation === CardLocation.TopTierSlot3) {
      return Tiers.Top;
    }
    if (cardLocation === CardLocation.MiddleTierSlot0
      || cardLocation === CardLocation.MiddleTierSlot1
      || cardLocation === CardLocation.MiddleTierSlot2
      || cardLocation === CardLocation.MiddleTierSlot3) {
      return Tiers.Middle;
    }
    return Tiers.Bottom;
  }

  getCardsRemainingInDeck(cards: Card[], tier: string): number {
    return cards.filter(x => x.tier === tier && x.cardLocation === CardLocation.Deck).length;
  }

  getCardLocation(): number {
    if (this.itemBeingDisplayed !== -1) {
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedTopTierCard0) {
        return CardLocation.TopTierSlot0;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedTopTierCard1) {
        return CardLocation.TopTierSlot1;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedTopTierCard2) {
        return CardLocation.TopTierSlot2;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedTopTierCard3) {
        return CardLocation.TopTierSlot3;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedMiddleTierCard0) {
        return CardLocation.MiddleTierSlot0;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedMiddleTierCard1) {
        return CardLocation.MiddleTierSlot1;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedMiddleTierCard2) {
        return CardLocation.MiddleTierSlot2;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedMiddleTierCard3) {
        return CardLocation.MiddleTierSlot3;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedBottomTierCard0) {
        return CardLocation.BottomTierSlot0;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedBottomTierCard1) {
        return CardLocation.BottomTierSlot1;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedBottomTierCard2) {
        return CardLocation.BottomTierSlot2;
      }
      if (this.itemBeingDisplayed === ItemBeingDisplayed.ReservedBottomTierCard3) {
        return CardLocation.BottomTierSlot3;
      }
    }
    return CardLocation.Deck;
  }

  confirmPurchaseOrReservation(): void {
    const cardLocation = this.getCardLocation();
    if (cardLocation !== CardLocation.Deck) {
      if (this.game) {
        const game = JSON.parse(JSON.stringify(this.game));
        const playerOwnershipNum = getIntegerRepresentingPlayerCardOwnershipLocation(this.game.turn);
        const playerKnownReservedNum = getIntegerRepresentingPlayerCardKnownReservedLocation(this.game.turn);
        const playerSecretReservedNum = getIntegerRepresentingPlayerCardSecretReservedLocation(this.game.turn);
        const newLocationNum = (this.itemBeingDisplayed >= ItemBeingDisplayed.ReservedTopTierUnknownCard
          && this.itemBeingDisplayed <= ItemBeingDisplayed.ReservedBottomTierUnknownCard)
          ? playerSecretReservedNum : (this.itemBeingDisplayed >= ItemBeingDisplayed.ReservedTopTierCard0
            && this.itemBeingDisplayed <= ItemBeingDisplayed.ReservedBottomTierCard3) ? playerKnownReservedNum
            : playerOwnershipNum;
        const filteredCards = game.cards.filter(card => card.cardLocation === cardLocation);
        if (filteredCards.length > 0) {
          filteredCards[0].cardLocation = newLocationNum;
          const tier = this.getTier(cardLocation);
          if (this.getCardsRemainingInDeck(game.cards, tier) > 0) {
            const cardsStillInDeck = game.cards.filter(card => card.cardLocation === CardLocation.Deck
              && card.tier === tier);
            const r = randomNumber(0, cardsStillInDeck.length - 1);
            cardsStillInDeck[r].cardLocation = cardLocation;
          }
        }
        if (newLocationNum === playerOwnershipNum) {
          console.log('you should not be in here yet');
        } else {
          game.players[this.game.turn].circles[0] += this.game.contemplatedCirclesToTake[0];
          game.players[this.game.turn].circles[1] += this.game.contemplatedCirclesToTake[1];
          game.players[this.game.turn].circles[2] += this.game.contemplatedCirclesToTake[2];
          game.players[this.game.turn].circles[3] += this.game.contemplatedCirclesToTake[3];
          game.players[this.game.turn].circles[4] += this.game.contemplatedCirclesToTake[4];
          game.contemplatedCirclesToTake = [0, 0, 0, 0, 0, 0];
          game.players[this.game.turn].circles[5] += this.getRandomTokenCost();
          game.turn = game.turn < game.players.length - 1 ? game.turn + 1 : 0;
        }
        this.webSocketService.emit('update-squarekles-game', game);
      }
    }
  }

}
