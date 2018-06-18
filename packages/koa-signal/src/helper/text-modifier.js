import chalk from 'chalk'

export default (config = {}, text) => [
  config.uppercase && ((s = '') => s.toUpperCase()),
  config.underline && ((s = '') => chalk.underline(s)),
  config.italic && ((s = '') => chalk.italic(s))
].reduce((acc, it) => it ? it(acc) : acc, text)
