import defaultConfig from './koa-prometheus.defaults.json'
import standardsConfig from './koa-prometheus.standards.json'
import { register, collectDefaultMetrics } from 'prom-client'

import { removeBlanks } from './utils/s'
import { uniqueElementsByRight } from './utils/arr'

import buildMeters from './utils/build-meters'
import buildMarker from './utils/build-marker'
import printMeters from './utils/metrics-meter'

export const collectMetrics = ({ prefix = 'koa_' }) => {
  collectDefaultMetrics({ prefix, timestamps: false })
}

const middleware = (meters) => function prometheus(ctx, next) {
  ctx.state = { ...(ctx.state || {}), meters }
  return next()
}

export default (
  userConfig = [],
  { loadDefaults = true, overrideDefaults = true, loadStandards = false } = {}
) => {
  register.clear()

  const combinedConfig = []
    .concat(loadDefaults ? defaultConfig : [])
    .concat(loadStandards ? standardsConfig : [])
    .concat(userConfig)

  const config = overrideDefaults
    ? uniqueElementsByRight(combinedConfig, (a, b) => a.name === b.name)
    : combinedConfig

  const meters = buildMeters(config)
  const automark = buildMarker(config)
  const print = buildPrinter(config, meters)

  return { ...meters, automark, print, middleware: middleware(meters) }
}

const buildPrinter = (config, meters) => async () => {
  const metrics = await register.metrics()
  return removeBlanks([metrics, ...printMeters(config, meters)].join("\n"))
}
