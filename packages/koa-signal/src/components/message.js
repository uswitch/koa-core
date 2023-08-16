import { bold } from 'picocolors'
import format from '../helper/format'

const isObject = obj => obj === Object(obj)

const _string = (config, ctx) => format(config, ctx)
const _object = (config, obj) => Object
  .entries(obj)
  .filter(([key, val]) => key !== 'original' && !!val)
  .map(([key, val]) => `${bold(key)}: ${val}`)

/* Config and then passed Koa ctx & msg */
export default (config = {}) => (ctx, obj) => {
  const { properties = [ 'msg', 'message', 'text' ] } = config

  if (typeof obj === 'string') return _string(config, obj)
  if (typeof ctx === 'string') return _string(config, ctx)
  if (obj && isObject(obj)) return _object(config, obj)

  const prop = properties.find(prop => !!ctx[prop])
  return format(config, ctx[prop])
}
