import toMessage from './src/to-message'
import { getTimeDiff, getInitDiff } from './src/helper-selectors'

export const DEFAULT_KEY = '__general'
export const defaultKey = DEFAULT_KEY

/* Event strings */
export const eventTrace = 'koa-tracer:trace'
export const eventError = 'koa-tracer:error'

export const trace = (ctx, key, message) => {
  if (!message) { message = key; key = DEFAULT_KEY }

  const trace = {
    time: new Date(),
    timeDiff: getTimeDiff(ctx, key),
    initDiff: getInitDiff(ctx, key),
    ...toMessage(message)
  }

  ctx.state.trace = { [key]: { traces: [] }, ...ctx.state.trace }

  const newTraces = ctx.state.trace[key].traces.concat(trace)
  ctx.state.trace[key] = {
    traces: newTraces,
    tracesLength: newTraces.length,
    timeDiff: trace.timeDiff,
    initDiff: trace.initDiff
  }

  ctx.app && ctx.app.emit(eventTrace, { ctx, key, trace })
}

export const traceError = (ctx, err) => {
  const error = { time: new Date(), ...toMessage(err) }

  ctx.state.errors = [ ...ctx.state.errors || [], error ]
  ctx.state.errorsCount = ctx.state.errors.length

  ctx.app && ctx.app.emit(eventError, { ctx, error, original: err })
}

export default () => async (ctx, next) => {
  ctx.state = { ...ctx.state, trace: {}, traceStart: new Date() }
  ctx.state = { ...ctx.state, errors: [], errorsCount: 0 }

  ctx.trace = trace.bind({}, ctx)
  ctx.error = traceError.bind({}, ctx)

  await next()
}
