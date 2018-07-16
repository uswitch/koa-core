import join from '../helper/safe-join'

/* Config and then passed Koa ctx & msg */
export default (config = {}) => (ctx = {}, extras = {}) => {
  const { format = '' } = config
  const tokens = format.match(/:\w+/g)

  const req = { ...extras.req, ...ctx.req }
  const res = { ...extras.res, ...ctx.res }

  return tokens.reduce((acc, it) => {
    const [ token, slurp ] = it.split('_')

    const key = token.slice(1)
    const replacement = join([res[key] || req[key], slurp], '')

    return acc.replace(it, replacement || '')
  }, format).replace(/ +/g, ' ')
}
