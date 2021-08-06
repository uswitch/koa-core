import koaZipkin from '@uswitch/koa-zipkin'

import axios from 'axios'
import cache from 'axios-cache-adapter'

const { middleware, fetch, Logger, Tracer } = koaZipkin
const { USE_CACHE = true, NODE_ENV, APP_NAME = 'example-uf-service' } = process.env

const { adapter } = cache.setupCache({ maxAge: USE_CACHE ? 10 * 1000 : 0 })
const fetchClient = axios.create({ adapter })

/* Mark the intent of using a cache */
fetchClient.interceptors.response.use(
  (res) => {
    res.headers['X-Cache-Enabled'] = true
    return res
  },
  Promise.reject
)

const tracer = Tracer(APP_NAME, Logger({ local: NODE_ENV === 'development' }))

export const zipkin = middleware({ tracer })
export const zipkinFetch = fetch({ local: APP_NAME, fetch: fetchClient, tracer })
