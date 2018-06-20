const Koa = require('koa')

const { default: Signal } = require('@uswitch/koa-signal')
const { default: access, eventAccess } = require('@uswitch/koa-access')
const { default: tracer, eventTrace, eventError } = require('@uswitch/koa-tracer')

const { merge } = require('./merge')
const productionConf = require('./__config__/signal-config.production.json')

module.exports = (config = {}) => {
  const app = new Koa()

  const { NODE_ENV } = process.env
  const { dev = 'development', accessConf = [], signalConf = {} } = config

  const signalConfig = NODE_ENV === dev ? signalConf : merge(signalConf, productionConf)
  const signal = Signal(signalConfig)

  app.use(tracer())
  app.use(access([ 'id', 'trace', 'errors' ].concat(accessConf)))

  app.on(eventTrace, ({ ctx, key, trace }) => signal.trace({...ctx, ...trace, scope: key}))
  app.on(eventError, ({ ctx, error }) => signal.error(ctx, error.original))
  app.on(eventAccess, signal.access)

  return { app, signal }
}
