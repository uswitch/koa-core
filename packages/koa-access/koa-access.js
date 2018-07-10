import onFinished from 'on-finished'

/* Event string */
export const eventAccess = 'koa-access:access'

export default (extraKeys = []) => async (ctx, next) => {
  const time = new Date()

  onFinished(ctx.res, () => {
    const responseTime = new Date() - time
    const { length, status } = ctx.response
    const { method, path, ip: host } = ctx.request

    const [ bucket, ...rest ] = status || ''
    const statusBucket = bucket + rest.map(i => 'X').join('')

    /* Cast all integers to integers */
    const res = { responseTime: +responseTime, length: +length, status: +status, statusBucket, time: new Date() }
    const req = { method, path, time, host }

    const extras = extraKeys instanceof Function
      ? extraKeys(ctx)
      : extraKeys.reduce((acc, it) => ctx.state[it] ? { ...acc, [it]: ctx.state[it] } : acc, {})

    ctx.app && ctx.app.emit(eventAccess, ctx, { req, res, ...extras })
  })

  await next()
}
