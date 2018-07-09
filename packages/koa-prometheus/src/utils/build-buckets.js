import client from 'prom-client'

const buildBuckets = config => {
  if (Array.isArray(config)) return config
  const { type, start, factor, buckets } = config

  if (process.env.DEBUG_KOA) console.log('BUCKET:', config)

  return client[`${type}Buckets`](start, factor, buckets)
}

export default buildBuckets
