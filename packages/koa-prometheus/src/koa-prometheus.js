import defaultConfig from './koa-prometheus.defaults.json'
import { register } from 'prom-client'

import buildMeters from './utils/build-meters'

export default (userConfig = []) => {
  const config = defaultConfig.concat(userConfig)
  const meters = buildMeters(config)

  return meters
}

export const getMetrics = register.metrics.bind(register)
