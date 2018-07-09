import defaultConfig from './koa-prometheus.defaults.json'
import { register } from 'prom-client'

import { removeBlanks } from './utils/s'

import buildMeters from './utils/build-meters'
import buildMarker from './utils/build-marker'
import printMeters from './utils/metrics-meter'

const middleware = (meters) => (ctx, next) => (ctx.state = { ...(ctx.state || {}), meters }) && next()

export default (userConfig = []) => {
  const config = defaultConfig.concat(userConfig)

  const meters = buildMeters(config)
  const mark = buildMarker(config)
  const printer = buildPrinter(config, meters)

  return { mark, metricsPrinter: printer, metricsMiddleware: middleware(meters) }
}

const buildPrinter = (config, meters) => (ctx, next) => {
  if (ctx.request.path !== '/metrics') return next()

  const metricsBody = [register.metrics(), printMeters(config, meters)].join('\n')
  ctx.body = removeBlanks(metricsBody)
}
