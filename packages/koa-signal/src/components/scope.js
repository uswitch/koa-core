import chalk from 'chalk'
import format from '../helper/format'

/* Config and then passed Koa ctx & msg */
export default (config = {}) => (ctx = {}) => {
  const {
    scopeKey = 'scope', upperCase = true,
    underline = false, italic = false
  } = config

  const scopeText = [
    upperCase && ((s = '') => s.toUpperCase()),
    underline && ((s = '') => chalk.underline(s)),
    italic && ((s = '') => chalk.italic(s))
  ].reduce((acc, it) => it ? it(acc) : acc, ctx[scopeKey])

  return format(config, scopeText)
}
