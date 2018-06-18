export default ({ separator = ' ' } = {}) => (inputs, ...rest) => {
  const printable = Array.isArray(inputs) ? inputs : [ inputs, ...rest ]
  console.log(printable.filter(i => i).join(separator))
}
