export function isEqual(arr1: Array<string | number | object>, arr2: Array<string | number | object>) {
  if (arr1.length !== arr2.length) return false

  return arr1.every((value, index) => value === arr2[index])
}
