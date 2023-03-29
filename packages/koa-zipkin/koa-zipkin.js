import { BatchRecorder, Annotation, Tracer as T } from 'zipkin'
import koaMiddleware from './koa-zipkin-instrumentation-koa'

import Context from 'zipkin-context-cls'
import wrap from 'zipkin-instrumentation-fetch'
import wrapTags from './koa-wrap-fetch'

const { NODE_DEBUG } = process.env
const debug = msg => NODE_DEBUG && console.log(`koa-zipkin | ${msg}`)

/**
 * Creates a Zipkin Tracer, using ContextCLS and BatchRecorder
 * @param {string} localServiceName - The local name of this service
 * @param {object} logger - An instantiated Logger object
 * @param {boolean} allowAsync - Required for compatability with the ContextCLS
 * library if your code uses promises or async/await. Note there are known
 * performance issues with Node < 16.3.0.
 * See https://github.com/openzipkin/zipkin-js/tree/master/packages/zipkin-context-cls#a-note-on-cls-context-and-promises
 * @returns {object}
 */
export const Tracer = (localServiceName, logger, allowAsync = false) => new T({
  localServiceName,
  ctxImpl: new Context('zipkin', allowAsync),
  recorder: new BatchRecorder({ logger })
})

/**
 * Creates a zipkin span based on the request context
 * This requires the server to be instrumented with zipkin
 * @param {Object} ctx - The koa request context
 * @param {Object} o.tracer - The tracer object
 * @param {string} o.scope - The trace scope/span name
 * @param {number} o.start - The trace start time in seconds or microseconds
 * @param {number} o.stop - The trace start time in seconds or microseconds
 * @param {number} [o.tMod] - Time normalisin coefficient, defaults to 1000 to convert millis into micros
 * @param {string} [o.serviceName] - the service name to log, deaults to `koa-server` or read from tracer
 * @param {string[][]} [o.annotations] - A list of key value pairs of message & timestamp to mark as annotations for a span
 * @returns {Promise}
 */
export const createSpan = async (
  ctx,
  {
    tracer,
    scope,
    start,
    stop,
    tMod = 1000,
    serviceName = 'koa-server',
    annotations = []
  }
) => {
  if (!ctx.request._trace_id) {
    debug('ctx did not include `_trace_id` - please instrument with `zipkin-instrumentation-koa`')
    return
  }

  debug(`Creating span for ${scope} - ${start}:${stop}`)
  await tracer.scoped(() => {
    tracer.setId(tracer.createChildId(ctx.request._trace_id))
    tracer.recordServiceName(serviceName)

    annotations.map(([msg, ts]) => tracer.recordAnnotation(new Annotation.Message(msg), ts * tMod))
    tracer.recordAnnotation(new Annotation.LocalOperationStart(scope), start * tMod)
    tracer.recordAnnotation(new Annotation.LocalOperationStop(scope), stop * tMod)
  })

  debug(`koa-zipkin | Traces annotation for ${scope}`)
}

/**
 * Create a trace span
 * This generates a span based on a `koa-tracer` trace object
 * It is opinionated by the model of the trace
 * @param {Object} ctx - the Koa request context
 * @param {string} o.scope - The trace scope
 * @param {*} tracer - The zipkin instrumentation Tracer
 * @param {*} trace - The `koa-tracer` trace object
 * @returns {Promise}
 */
export const createTraceSpan = (ctx, { scope, trace, tracer, ...rest }) => {
  const start = trace.traces[0].time
  const stop = trace.traces.slice(-1)[0].time

  // Add `i` microseconds to each trace time to force sequential order
  // for traces that happen in the same millisecond
  const annotations = trace.traces.map(({ msg, time } = {}, i) => [msg, +time + (i / 1000)])

  return createSpan(ctx, { scope, tracer, annotations, start, stop, ...rest })
}

export const middleware = ({ tracer, serviceName = 'koa-server' }) => koaMiddleware({
  tracer, serviceName
})

export const fetch = ({ local, tracer, fetch }) => ({ remote }, ...rest) => {
  if (typeof remote !== 'string') throw new Error('Zipkin fetch was not provided a remote name: { remote: ... }')

  const f = wrap(
    wrapTags(fetch, { tracer }),
    {
      tracer,
      serviceName: local,
      remoteServiceName: remote
    }
  )

  return f(...rest)
}

export const zipkin = middleware // Rename for when you have multiple middlewares
export { default as Logger } from './koa-zipkin-logger'
export default { fetch, middleware }
