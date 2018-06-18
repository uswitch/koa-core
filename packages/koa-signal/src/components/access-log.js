/* Config and then passed Koa ctx & msg */
export default (config = {}) => (ctx = {}, extras = {}) => {
  const {
    access = ':method :url :path :statusCode :length -- :responseTime_ms -- :statusMessage'
  } = config

  const tokens = access.match(/:\w+/g)

  const req = { ...extras.req, ...ctx.req }
  const res = { ...extras.res, ...ctx.res }

  return tokens.reduce((acc, it) => {
    const [ token, slurp ] = it.split('_')

    const key = token.slice(1)
    const replacement = [res[key] || req[key], slurp].filter(i => i).join('')

    return acc.replace(it, replacement || '')
  }, access)
}
