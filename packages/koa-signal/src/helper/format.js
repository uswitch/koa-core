import pc from 'picocolors'

export default (config, text) => {
  if (!text) return

  const {
    displayFormat = '%s',
    alignment = 'left',
    color,
    minimumWidth
  } = config

  const padF = alignment === 'left' ? 'padEnd' : 'padStart'
  const displayText = minimumWidth ? text[padF](minimumWidth) : text

  const colorF = Array.isArray(color)
    ? color.reduce((acc, it) => (msg) => acc(pc[it](msg)), pc.reset)
    : pc[color] || (i => i)

  return colorF(displayFormat.replace('%s', displayText))
}
