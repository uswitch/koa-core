import Koa from 'koa'

import Signal from '@uswitch/koa-signal'
import access, { eventAccess } from '@uswitch/koa-access'
import tracer, { eventTrace, eventError } from '@uswitch/koa-tracer'

import { merge } from './merge'
import productionConf from './__config__/signal-config.production.json'

export default (config = {}) => {
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
