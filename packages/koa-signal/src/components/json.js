const splitPath = (p = []) => {
  if (Array.isArray(p)) return [p]

  const [ _, key ] = p.split(':')
  const path = _.split('.')

  return [ path, key || path.slice(-1)[0] ]
}

const pathAsObj = (obj, p = []) => {
  const [ path, key ] = splitPath(p)
  const val = path.reduce((acc, it) => (acc && acc[it]) ? acc[it] : undefined, obj)

  return val && { [key]: val }
}

const pluck = (obj, props = []) => props
  .reduce((acc, it) => pathAsObj(obj, it) ? { ...acc, ...pathAsObj(obj, it) } : acc, {})

/* Config and then passed Koa ctx & msg */
export default (config = {}) => (ctx, extras = {}) => {
  const {
    properties = [],
    defaultProperties = [ 'res', 'req' ],
    humanReadable = false
  } = config

  const accessObj = { ...ctx, ...extras }
  const props = defaultProperties.concat(properties)

  if (process.env.DEBUG_KOA_SIGNAL) console.log(accessObj)
  if (process.env.DEBUG_KOA_SIGNAL) console.log(props)

  const json = pluck(accessObj, props)
  return JSON.stringify(json, null, humanReadable ? 2 : 0)
}
