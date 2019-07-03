import format from '../helper/format'

/* Config and then passed Koa ctx & msg */
export default (config = {}) => ({ res = {} }) => {
  const { properties = {}, configArg } = config

  const map = properties[configArg] || {}

  const key = res[configArg] || ''
  const val = map[key] || ''

  if (typeof val === 'undefined') return ''
  return typeof val === 'string'
    ? format(config, val)
    : format({...config, ...val}, val.text)
}
