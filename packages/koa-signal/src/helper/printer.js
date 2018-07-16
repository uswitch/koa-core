import flatten from './flatten'

export default ({ separator = ' ' } = {}) => (...inputs) => {
  const printable = flatten(inputs)
  const output = printable.filter(i => i).join(separator)

  if (!output.trim()) return

  console.log(output)
}
