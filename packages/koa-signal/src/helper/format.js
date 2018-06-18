import chalk from 'chalk'

export default (config, text) => {
  const {
    displayFormat = '%s',
    color = 'black'
  } = config

  const chalkF = Array.isArray(color)
    ? color.reduce((acc, it) => acc[it], chalk)
    : chalk[color]

  return chalkF(displayFormat.replace('%s', text))
}
