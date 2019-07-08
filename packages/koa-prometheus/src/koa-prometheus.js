import defaultConfig from './koa-prometheus.defaults.json'
import collectGcMetrics from 'prometheus-gc-stats'
import { register, collectDefaultMetrics } from 'prom-client'

import { removeBlanks } from './utils/s'
import { uniqueElementsByRight } from './utils/arr'

import buildMeters from './utils/build-meters'
import buildMarker from './utils/build-marker'
import printMeters from './utils/metrics-meter'

export const collectMetrics = ({ prefix = 'koa_' }) => {
  collectGcMetrics(register, { prefix }).call({})
  collectDefaultMetrics({ prefix, timestamps: false })
}

const middleware = (meters) => (ctx, next) => (ctx.state = { ...(ctx.state || {}), meters }) && next()

export default (
  userConfig = [],
  { loadDefaults = true, overrideDefaults = true } = {}
) => {
  register.clear()

  const combinedConfig = loadDefaults
    ? defaultConfig.concat(userConfig)
    : userConfig

  const config = overrideDefaults
    ? uniqueElementsByRight(combinedConfig, (a, b) => a.name === b.name)
    : combinedConfig

  const meters = buildMeters(config)
  const automark = buildMarker(config)
  const print = buildPrinter(config, meters)

  return { ...meters, automark, print, middleware: middleware(meters) }
}

const buildPrinter = (config, meters) => () => removeBlanks([register.metrics(), ...printMeters(config, meters)].join('\n'))
