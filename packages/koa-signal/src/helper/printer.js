const flatten = arr => [].concat(...arr.map(it => Array.isArray(it) ? flatten(it) : it))

export default ({ separator = ' ' } = {}) => (...inputs) => {
  const printable = flatten(inputs)
  console.log(printable.filter(i => i).join(separator))
}
