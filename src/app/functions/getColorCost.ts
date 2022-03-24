import {getTotalItemsWithNonZeroCost} from './getTotalItemsWithNonZeroCost';
import {getNthElementWithNonZeroValue} from './getNthElementWithNonZeroValue';

export function getColorCost(cost, index, maxPossible = 4) {
  const totalElementsWithNonZeroCost = getTotalItemsWithNonZeroCost(cost);
  // const adjustedIndex = totalElementsWithNonZeroCost > 3 ? index + 1 : totalElementsWithNonZeroCost > 2 ? index : index - 1;
  const adjustedIndex = index + totalElementsWithNonZeroCost - maxPossible;
  const nthElementWithNonZeroValue = getNthElementWithNonZeroValue(cost, adjustedIndex);
  return cost[nthElementWithNonZeroValue];
}
