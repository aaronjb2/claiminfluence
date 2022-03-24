export function getTotalItemsWithNonZeroCost(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      total++;
    }
  }
  return total;
}
