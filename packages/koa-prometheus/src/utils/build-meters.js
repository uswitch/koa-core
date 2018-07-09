import client from 'prom-client'
import buildBuckets from './build-buckets'
import { camelCase } from './s'

export default meters => meters
  .reduce((acc, config) => {
    const { name, type, percentiles } = config
    const buckets = buildBuckets(config.buckets || [])

    if (process.env.DEBUG_KOA) console.log('METER:', config)

    const Meter = client[type]
    if (!Meter) throw new Error(`Unknown meter type: ${type}`)

    const meter = new Meter({ ...config, percentiles, buckets })
    return { ...acc, [camelCase(name)]: meter }
  }, {})
