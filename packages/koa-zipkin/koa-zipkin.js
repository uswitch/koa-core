import { BatchRecorder, Annotation, Tracer as T } from 'zipkin'
import { koaMiddleware } from 'zipkin-instrumentation-koa'

import Context from 'zipkin-context-cls'
import wrap from 'zipkin-instrumentation-fetch'
import wrapTags from './koa-wrap-fetch'

const { NODE_DEBUG } = process.env
const debug = msg => NODE_DEBUG && console.log(`koa-zipkin | ${msg}`)

export const Tracer = (localServiceName, logger) => new T({
  localServiceName,
  ctxImpl: new Context('zipkin'),
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
 * @param {string[][]} [o.data] - A list of key value pairs to mark as binary data
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
    data = []
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

    data.map(([msg, ts]) => tracer.recordAnnotation(new Annotation.Message(msg), ts * tMod))
    tracer.recordAnnotation(new Annotation.LocalOperationStart(scope), start * tMod)
    tracer.recordAnnotation(new Annotation.LocalOperationStop(scope), stop * tMod)
  })

  debug(`koa-zipkin | Traces annotation for ${scope}`)
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
