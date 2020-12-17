export const path = (arr, obj, def = undefined) =>
  arr.reduce((acc, it) => (acc !== def && {}.hasOwnProperty.call(acc, it) ? acc[it] : def), obj)
