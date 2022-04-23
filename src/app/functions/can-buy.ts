import {getQuantityLackingForPurchase} from './get-quantity-lacking-for-purchase';
import {Player} from '../squarekles-game/interfaces/player';
import {Card} from '../squarekles-game/interfaces/card';

export function canBuy(color: number, playerIndex: number, player: Player, cards: Card[], cost: number[],
                       contemplatedCirclesToTake = [0, 0, 0, 0, 0, 0]): boolean {
  const quantityToSubtract = contemplatedCirclesToTake[5] < 0 ? contemplatedCirclesToTake[5] : 0;
  const quantityLacking = getQuantityLackingForPurchase(color, playerIndex, player, cards, cost, contemplatedCirclesToTake);
  return quantityLacking <= player.circles[5] + quantityToSubtract;
}
