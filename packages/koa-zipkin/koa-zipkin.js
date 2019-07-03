import { BatchRecorder, Tracer as T } from 'zipkin'
import { KoaInstrumentation } from 'zipkin-instrumentation-koa'

import Context from 'zipkin-context-cls'
import wrap from 'zipkin-instrumentation-fetch'
import wrapTags from './koa-wrap-fetch'

export const Tracer = (localServiceName, logger) => new T({
  localServiceName,
  ctxImpl: new Context('zipkin'),
  recorder: new BatchRecorder({ logger })
})

export const middleware = ({ tracer, serviceName = 'koa-server' }) => KoaInstrumentation({
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
