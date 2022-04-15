import {getQuantityLackingForPurchase} from './get-quantity-lacking-for-purchase';
import {Player} from '../squarekles-game/interfaces/player';
import {Card} from '../squarekles-game/interfaces/card';

export function canBuy(color: number, playerIndex: number, player: Player, cards: Card[], cost: number[]): boolean {
  const quantityLacking = getQuantityLackingForPurchase(color, playerIndex, player, cards, cost);
  return quantityLacking <= player.circles[5];
}
