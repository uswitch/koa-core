import { jsonEncoder } from 'zipkin'
import { HttpLogger } from 'zipkin-transport-http'

import Logger from '@uswitch/koa-signal'
const logger = new Logger()

const devLogger = {
  logSpan: (span, ...arg) => {
    const { duration, tags, remoteEndpoint = {}, name = '', parentId, id, kind } = span
    const { 'http.status_code': status, 'http.cache': cache = '' } = tags
    const url = kind === 'SERVER' ? tags['http.url'] : tags['http.path']
    const remote = kind === 'SERVER' ? '' : remoteEndpoint.serviceName
    const req = { method: (name || '').toUpperCase(), remoteEndpoint: remote, url }
    const res = { statusCode: +status, duration, cache }
    logger.zipkin({ state: { parent: parentId, scope: id }, kind, req, res })
  }
}

export default ({ local = false, endpoint, ...args }) => local
  ? devLogger
  : new HttpLogger({ endpoint, jsonEncoder: jsonEncoder.JSON_V2, ...args })
