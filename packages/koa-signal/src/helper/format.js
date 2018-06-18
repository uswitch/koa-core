import chalk from 'chalk'

export default (config, text) => {
  if (!text) return

  const {
    displayFormat = '%s',
    alignment = 'left',
    color = 'black',
    minimumWidth
  } = config

  const padF = alignment === 'left' ? 'padEnd' : 'padStart'
  const displayText = minimumWidth ? text[padF](minimumWidth) : text
  const chalkF = Array.isArray(color)
    ? color.reduce((acc, it) => acc[it], chalk)
    : chalk[color]

  return chalkF(displayFormat.replace('%s', displayText))
}
