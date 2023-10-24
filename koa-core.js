const Koa = require('koa')

const zipkin = require('@uswitch/koa-zipkin')
const { default: Meters } = require('@uswitch/koa-prometheus')
const { default: Signal } = require('@uswitch/koa-signal')
const { default: access, eventAccess } = require('@uswitch/koa-access')
const { default: tracer, eventTrace, eventError } = require('@uswitch/koa-tracer')

const { merge } = require('./merge')
const prodSignalConf = require('./__config__/signal-config.production.json')
const prodPrometheusConf = require('./__config__/prometheus-config.production.json')

module.exports = (config = {}) => {
  const app = new Koa()

  const { NODE_ENV } = process.env
  const { zipkinTracer, dev = 'development', accessConf = [], signalConf = {}, prometheusConf } = config

  const signalConfig = NODE_ENV === dev ? signalConf : merge(signalConf, prodSignalConf)
  const signal = Signal(signalConfig)
  const meters = Meters(prometheusConf || prodPrometheusConf, { loadStandards: true, loadDefaults: false })

  app.use(async (ctx, next) => {
    if (ctx.request.path !== '/metrics') return next()
    ctx.body = await meters.print()
  })

  app.use(tracer())
  app.use(meters.middleware)
  app.use(access(['id', 'trace', 'errors', ...accessConf]))

  app.on(eventTrace, ({ ctx, key, trace }) => signal.trace({ ...ctx, ...trace, scope: key }))
  app.on(eventError, ({ ctx, original }) => signal.error(ctx, original))

  app.on(eventError, () => meters.koaErrorsPerSecond.mark(1))
  app.on(eventAccess, (ctx, extra) => meters.automark({ ...ctx, ...extra }))

  // Marks each trace as a prometheus metric & zipkin trace
  app.on(eventAccess, (ctx, { trace }) =>
    Object
      .entries(trace)
      .forEach(([scope, trace], order) => {
        if (zipkinTracer) // Only trace spans when a zipkin tracer is injected
          zipkin.createTraceSpan(
            ctx,
            { scope, trace, tracer: zipkinTracer }
          )

        if (meters.traceDurationMilliseconds)
          meters.traceDurationMilliseconds
            .labels(scope)
            .observe(trace.timeDiff / 1000) // Cast to seconds
      })
  )

  app.on(eventAccess, signal.access)

  return { app, meters, signal }
}
