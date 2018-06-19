import format from '../helper/format'
import modify from '../helper/text-modifier'

/* Config and then passed Koa ctx & msg */
export default (config = {}) => (ctx = {}) => {
  const { scopeKey = 'scope' } = config
  const scopeText = ctx[scopeKey]
  const scopes = [].concat(scopeText)

  return scopes.map(text => format(config, modify(config, text))).join('›')
}
