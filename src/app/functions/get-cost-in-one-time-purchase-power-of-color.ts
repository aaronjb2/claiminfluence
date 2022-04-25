import {SquarekleGame} from '../squarekles-game/interfaces/squarekle-game';
import {getIntegerRepresentingPlayerCardOwnershipLocation} from './get-integer-representing-player-card-ownership-location';
import {Card} from '../squarekles-game/interfaces/card';
import {Tiers} from '../squarekles-game/enums/tiers';
import {CardLocation} from '../squarekles-game/enums/card-location';

export function getCostInOneTimePurchasePowerOfColor(colorIndex: number, game: SquarekleGame, reserve: boolean = true, card: Card = {
  color: 0,
  cost: [1, 1, 1, 1, 0],
  tier: Tiers.Bottom,
  gameVersion: 0,
  hashtags: 0,
  pointValue: 0,
  cardLocation: CardLocation.Deck
}): number {
  if (game) {
    if (reserve) {
      if (colorIndex < 5) {
        return game.contemplatedCirclesToTake[colorIndex] < 0 ? game.contemplatedCirclesToTake[colorIndex] : 0;
      }
      if (colorIndex === 5) {
        if (game.contemplatedCirclesToTake[colorIndex] < 0) {
          return game.contemplatedCirclesToTake[colorIndex];
        }
        if (getReservedTokensHeldByPlayers(game) >= 5) {
          return 0;
        }
        if (alreadyHaveTenTokensAndAmNotGettingRidOfAny(game)) {
          return 0;
        }
        return 1;
      }
    } else {
      if (colorIndex === 5) {
        const ownershipNum = getIntegerRepresentingPlayerCardOwnershipLocation(game.turn);
        const pppColor0 = game.cards.filter(gameCard => {
          return gameCard.cardLocation === ownershipNum && gameCard.color === 0;
        }).length;
        const notCoveredByPpp0 = pppColor0 >= card.cost[0] ? 0 : card.cost[0] - pppColor0;
        const pppColor1 = game.cards.filter(gameCard => {
          return gameCard.cardLocation === ownershipNum && gameCard.color === 1;
        }).length;
        const notCoveredByPpp1 = pppColor1 >= card.cost[1] ? 0 : card.cost[1] - pppColor1;
        const pppColor2 = game.cards.filter(gameCard => {
          return gameCard.cardLocation === ownershipNum && gameCard.color === 2;
        }).length;
        const notCoveredByPpp2 = pppColor2 >= card.cost[2] ? 0 : card.cost[2] - pppColor2;
        const pppColor3 = game.cards.filter(gameCard => {
          return gameCard.cardLocation === ownershipNum && gameCard.color === 3;
        }).length;
        const notCoveredByPpp3 = pppColor3 >= card.cost[3] ? 0 : card.cost[3] - pppColor3;
        const pppColor4 = game.cards.filter(gameCard => {
          return gameCard.cardLocation === ownershipNum && gameCard.color === 4;
        }).length;
        const notCoveredByPpp4 = pppColor4 >= card.cost[4] ? 0 : card.cost[4] - pppColor4;
        const quantityLacking0 = game.players[game.turn].circles[0] + game.contemplatedCirclesToTake[0] > notCoveredByPpp0 ? 0
          : (notCoveredByPpp0 - game.players[game.turn].circles[0]) - game.contemplatedCirclesToTake[0];
        const quantityLacking1 = game.players[game.turn].circles[1] + game.contemplatedCirclesToTake[1] > notCoveredByPpp1 ? 0
          : (notCoveredByPpp1 - game.players[game.turn].circles[1]) - game.contemplatedCirclesToTake[1];
        const quantityLacking2 = game.players[game.turn].circles[2] + game.contemplatedCirclesToTake[2] > notCoveredByPpp2 ? 0
          : (notCoveredByPpp2 - game.players[game.turn].circles[2]) - game.contemplatedCirclesToTake[2];
        const quantityLacking3 = game.players[game.turn].circles[3] + game.contemplatedCirclesToTake[3] > notCoveredByPpp3 ? 0
          : (notCoveredByPpp3 - game.players[game.turn].circles[3]) - game.contemplatedCirclesToTake[3];
        const quantityLacking4 = game.players[game.turn].circles[4] + game.contemplatedCirclesToTake[4] > notCoveredByPpp4 ? 0
          : (notCoveredByPpp4 - game.players[game.turn].circles[4]) - game.contemplatedCirclesToTake[4];
        return ((quantityLacking0 + quantityLacking1 + quantityLacking2 + quantityLacking3 + quantityLacking4) * -1)
          + game.contemplatedCirclesToTake[5];
      }
      if (colorIndex < 5) {
        const ownershipNum = getIntegerRepresentingPlayerCardOwnershipLocation(game.turn);
        const ppp = game.cards.filter(gameCard => {
          return gameCard.cardLocation === ownershipNum && gameCard.color === colorIndex;
        }).length;
        const selfAfflictedDamage = game.contemplatedCirclesToTake[colorIndex] < 0
          ? game.contemplatedCirclesToTake[colorIndex] : 0;
        return ppp - card.cost[colorIndex] >= 0 ? selfAfflictedDamage
          : game.players[game.turn].circles[colorIndex] >= card.cost[colorIndex] - ppp
            ? -1 * (card.cost[colorIndex] - ppp) + selfAfflictedDamage : (game.players[game.turn].circles[colorIndex] * -1);
      }
    }
  }
  return 0;
}

function getReservedTokensHeldByPlayers(game: SquarekleGame): number {
  let reservedTokensHeldByPlayers = 0;
  game.players.forEach(player => {
    reservedTokensHeldByPlayers += player.circles[5];
  });
  return reservedTokensHeldByPlayers;
}

function alreadyHaveTenTokensAndAmNotGettingRidOfAny(game: SquarekleGame): boolean {
  const tokensHeld = game.players[game.turn].circles.reduce((a, b) => a + b);
  const tokensBeingGottenRidOf = game.contemplatedCirclesToTake.reduce((a, b) => a + b);
  return tokensHeld + tokensBeingGottenRidOf >= 10;
}

