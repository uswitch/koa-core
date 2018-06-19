const path = (obj, path = []) => typeof path === 'string'
  ? path.split('.').reduce((acc, it) => (acc && acc[it]) ? acc[it] : undefined, obj)
  : path.reduce((acc, it) => (acc && acc[it]) ? acc[it] : undefined, obj)

const pluck = (obj, props = []) => props
  .reduce((acc, it) => path(obj, it) ? { ...acc, [it]: path(obj, it) } : acc, {})

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
