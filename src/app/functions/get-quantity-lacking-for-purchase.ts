import {Player} from '../squarekles-game/interfaces/player';
import {Card} from '../squarekles-game/interfaces/card';
import {getTotalPurchasePowerBeforeRandomTokens} from './get-total-purchase-power-before-random-tokens';

export function getQuantityLackingForPurchase(color: number, playerIndex: number, player: Player, cards: Card[], cost: number[]): number {
  let quantityLacking = 0;
  cost.forEach((item, index) => {
    const purchasePower = getTotalPurchasePowerBeforeRandomTokens(index, playerIndex, player, cards);
    quantityLacking += (item - purchasePower > 0 ? item - purchasePower : 0);
  });
  return quantityLacking;
}
