const flatten = arr => [].concat(...arr.map(it => Array.isArray(it) ? flatten(it) : it))
export default flatten
