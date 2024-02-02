export const uniqueElementsByRight = (arr, fn) =>
  arr.reduceRight((acc, v) => {
    if (!acc.some(x => fn(v, x))) acc.push(v)
    return acc
  }, [])

export const groupBy = (arr, fn, nomatch = 'default') =>
  arr.reduce((acc, it) => ({
    ...acc,
    [fn(it) || nomatch]: (acc[fn(it)] || []).concat(it)
  }), {})
