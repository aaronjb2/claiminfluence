import {SquarekleGame} from '../squarekles-game/interfaces/squarekle-game';
import {getIntegerRepresentingPlayerCardOwnershipLocation} from './get-integer-representing-player-card-ownership-location';

export function gainHashtagAward(game: SquarekleGame): boolean {
  if (!game.hashtagMode) {
    return false;
  }
  const playerHashtagQuantities = [];
  for (let i = 0; i < game.players.length; i++) {
    playerHashtagQuantities.push(getPlayerHashtags(i, game));
  }
  if (playerHashtagQuantities[game.turn] < 3) {
    return false;
  }
  let playerHasTheMost = true;
  for (let i = 0; i < playerHashtagQuantities.length; i++) {
    if (i !== game.turn && playerHashtagQuantities[i] >= playerHashtagQuantities[game.turn]) {
      playerHasTheMost = false;
    }
  }
  return playerHasTheMost;
}

function getPlayerHashtags(playerIndex: number, game: SquarekleGame): number {
  let playerHashtags = 0;
  const playerOwnershipNum = getIntegerRepresentingPlayerCardOwnershipLocation(playerIndex);
  const playerCards = game.cards.filter(card => card.cardLocation === playerOwnershipNum);
  for (let i = 0; i < playerCards.length; i++) {
    playerHashtags += playerCards[i].hashtags;
  }
  return playerHashtags;
}
