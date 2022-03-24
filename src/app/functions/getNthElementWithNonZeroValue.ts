export function getNthElementWithNonZeroValue(arr, n) {
  const thingsThatAreNotZero = getAllIndexesOfThingsThatAreNotZero(arr);
  if (n > thingsThatAreNotZero.length - 1) {
    return 4;
  }
  return thingsThatAreNotZero[n];
}

function getAllIndexesOfThingsThatAreNotZero(arr) {
  const thingsThatAreNotZero = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      thingsThatAreNotZero.push(i);
    }
  }
  return thingsThatAreNotZero;
}
