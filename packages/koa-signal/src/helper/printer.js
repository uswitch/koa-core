const flatten = arr => [].concat(...arr.map(it => Array.isArray(it) ? flatten(it) : it))

export default ({ separator = ' ' } = {}) => (...inputs) => {
  const printable = flatten(inputs)
  const output = printable.filter(i => i).join(separator)

  if (!output.trim()) return

  console.log(output)
}
