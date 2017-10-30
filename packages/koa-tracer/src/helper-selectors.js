import { DEFAULT_KEY } from '../koa-tracer'

const path = (path, o) => path.reduce((acc, it) => acc ? acc[it] : undefined, o)

const getTraces = (ctx, key) => path(['state', 'trace', key], ctx) || []
const getFirstTrace = (ctx, key) => getTraces(ctx, key)[0] || { time: new Date() }

export const getTimeDiff = (ctx, key) => key !== DEFAULT_KEY
  ? new Date() - getFirstTrace(ctx, key).time
  : undefined

export const getInitDiff = (ctx, key) => ctx.state.traceStart
  ? (new Date() - ctx.state.traceStart)
  : undefined
