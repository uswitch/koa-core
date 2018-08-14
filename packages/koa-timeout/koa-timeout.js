export default (time, { status = 408 } = {}) => (ctx, next) => {
  let timer
  const timeout = new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      ctx.state.timeout = true
      ctx.status = status
      ctx.body = `Request timedout: ${time}ms`

      reject(new Error(`Request timedout: ${time}ms`))
    }, time)
  })

  const clear = clearTimeout.bind({}, timer)
  return Promise
    .race([ timeout, next() ])
    .then(clear)
    .catch((ex) => {
      clear()
      if (ctx.state.timeout) return ctx.throw(408, 'Request timeout')
      throw ex
    })
}

export const shortCircuit = (...middlewares) => {
  const wrapped = middlewares.map(middleware => (ctx, next) => {
    if (ctx.state && ctx.state.timeout) return
    return middleware(ctx, next)
  })

  return middlewares.length === 1 ? wrapped[0] : wrapped
}
