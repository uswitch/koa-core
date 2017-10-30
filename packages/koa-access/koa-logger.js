/* Event string */
export const eventAccess = 'koa-logger:access'

export default (extraKeys = []) => async (ctx, next) => {
  const time = new Date()

  /* Wait for request to happen */
  await next()

  const responseTime = new Date() - time
  const { length, status } = ctx.response
  const { method, path, ip: host } = ctx.request

  /* Cast all integers to integers */
  const res = { responseTime: +responseTime, length: +length, status: +status, time: new Date() }
  const req = { method, path, time, host }

  const extras = extraKeys instanceof Function
        ? extraKeys(ctx)
        : extraKeys.reduce((acc, it) => ctx.state[it] ? { ...acc, [it]: ctx.state[it] } : acc, {})

  ctx.app && ctx.app.emit(eventAccess, { req, res, ...extras })
}
