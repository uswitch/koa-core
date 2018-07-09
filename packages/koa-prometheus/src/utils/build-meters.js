import { Meter } from 'metrics'
import { camelCase } from './s'

import client from 'prom-client'
import buildBuckets from './build-buckets'
import { isMetricsMeter } from './metrics-meter'

const getLabels = (names = []) => names.map(it => it.key || it)

const metricsMeter = () => new Meter()
const prometheusMeter = (config) => {
  const { type, percentiles = [0.01, 0.05, 0.5, 0.9, 0.95, 0.99, 0.999] } = config
  const buckets = buildBuckets(config.buckets || [])
  const labelNames = getLabels(config.labelNames)

  if (process.env.DEBUG_KOA) console.log('METER:', config)

  const Meter = client[type]
  if (!Meter) throw new Error(`Unknown meter type: ${type}`)

  return new Meter({ ...config, percentiles, buckets, labelNames })
}

export default meters => meters
  .reduce((acc, config) => {
    const { name } = config
    const meter = isMetricsMeter(config)
      ? metricsMeter(config)
      : prometheusMeter(config)

    return { ...acc, [camelCase(name)]: meter }
  }, {})
