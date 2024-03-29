// Copyright 2020 The OpenZipkin Authors; licensed to You under the Apache License, Version 2.0.
// Copied in from https://github.com/openzipkin/zipkin-js/blob/ec89188cf6a07e184ab886c1dfb6c9dc276ddfa4/packages/zipkin-instrumentation-koa/src/koaMiddleware.js
// to fix the bug where all exceptions in middleware are swallowed by the .catch

import {option, Instrumentation} from 'zipkin'

const {Some, None} = option

/**
 * @typedef {Object} MiddlewareOptions
 * @property {Object} tracer
 * @property {string} serviceName
 * @property {number} port
 */

/**
 * @param {MiddlewareOptions}
 * @return {ZipkinKoaMiddleware}
 */
export default function koaMiddleware ({tracer, serviceName, port = 0}) {
  const instrumentation = new Instrumentation.HttpServer({tracer, serviceName, port})

  /**
   * @method
   * @typedef {function} ZipkinKoaMiddleware
   * @param {Object} ctx
   * @param {function()} next
   */
  return function zipkinKoaMiddleware (ctx, next) {
    function readHeader (header) {
      const val = ctx.request.headers[header.toLowerCase()]
      if (val != null) {
        return new Some(val)
      } else {
        return None
      }
    }
    return tracer.scoped(() => {
      const method = ctx.request.method.toUpperCase()
      const id = instrumentation.recordRequest(method, ctx.request.href, readHeader)

      Object.defineProperty(ctx.request, '_trace_id', {configurable: false, get: () => id})

      const recordResponse = () => {
        tracer.letId(id, () => {
          // support koa-route and koa-router
          const matchedPath = ctx.routePath || ctx._matchedRoute
          tracer.recordRpc(instrumentation.spanNameFromRoute(method, matchedPath, ctx.status))
          instrumentation.recordResponse(id, ctx.status)
        })
      }

      const recordError = (err) => {
        recordResponse()
        throw err
      }

      return next()
        .then(recordResponse)
        .catch(recordError)
    })
  }
};
