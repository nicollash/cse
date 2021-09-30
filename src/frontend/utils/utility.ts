export const hasSameValue = (arr) =>
  arr.filter((el) => el !== arr[0]).length === 0;
