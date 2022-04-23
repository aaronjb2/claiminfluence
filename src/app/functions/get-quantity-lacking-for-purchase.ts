import {Player} from '../squarekles-game/interfaces/player';
import {Card} from '../squarekles-game/interfaces/card';
import {getTotalPurchasePowerBeforeRandomTokens} from './get-total-purchase-power-before-random-tokens';

export function getQuantityLackingForPurchase(color: number, playerIndex: number, player: Player, cards: Card[], cost: number[],
                                              contemplatedCirclesToTake = [0, 0, 0, 0, 0, 0]): number {
  let quantityLacking = 0;
  cost.forEach((item, index) => {
    const quantityToSubtract = contemplatedCirclesToTake[index] < 0 ? contemplatedCirclesToTake[index] : 0;
    const purchasePower = getTotalPurchasePowerBeforeRandomTokens(index, playerIndex, player, cards) + quantityToSubtract;
    quantityLacking += (item - purchasePower > 0 ? item - purchasePower : 0);
  });
  return quantityLacking;
}
