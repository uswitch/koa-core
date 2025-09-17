import Router from 'koa-router'
import wait from './wait'
import { zipkinFetch } from './zipkin'

import Signal from '@uswitch/koa-signal'
const signal = Signal.default()

const cacheHit = ({ fromCache }) => fromCache !== true ? 'MISS' : 'HIT'
const router = new Router()
router.get('/hello', ctx => (ctx.body = 'Hello, world!'))
router.get('/hello/:name', ctx => (ctx.body = `Hello, ${ctx.params.name}!`))
router.get('/status/:status', ctx => (ctx.status = +ctx.params.status))

router.get('/error', ctx => {
  ctx.error(new Error('Something went wrong...'))
  ctx.status = 500
})

router.get('/multi-errors', async ctx => {
  ctx.error(new Error('Something went wrong...'))
  await wait(200)
  ctx.error(new Error('What?! It happened again...'))
  await wait(300)
  ctx.error(new Error('Third times a charm!'))

  ctx.status = 200
})

router.get('/scope/*', ctx => {
  const scopes = ctx.path.split('/').slice(2)
  ctx.trace(scopes, 'Scoped message')
  ctx.trace(scopes.slice(0, -1), 'Higher scope message')
  ctx.body = scopes
})

router.get('/trace/:timeout', async ctx => {
  ctx.trace('async', 'start')
  await wait(ctx.params.timeout)
  ctx.trace('async', 'finish')

  ctx.body = `I waited ${ctx.params.timeout}ms`
})

router.get('/trace', async ctx => {
  ctx.trace('wait', 'start')
  await wait(Math.round(Math.random() * 100))
  ctx.trace('wait', 'finish')
  ctx.trace('process', 'start')
  ctx.trace('sub process 1', 'start')
  await wait(Math.round(Math.random() * 300))
  ctx.trace('sub process 1', 'end')
  ctx.trace('sub process 2', 'start')
  await wait(Math.round(Math.random() * 200))
  ctx.trace('sub process 2', 'end')
  ctx.trace('process', 'end')

  ctx.status = 200
})

router.get('/signal/all', async ctx => {
  /* Signal examples */
  signal.success('This is a success message!')
  signal.info('This is an info message')
  signal.warn('This is a warning message')
  signal.error('Error message', new Error('This is an error'))

  ctx.status = 200
})

router.get('/zipkin', async ctx => {
  const url = 'https://postman-echo.com/get'
  const remote = 'postman-echo-test'
  const method = 'GET'

  const body = await zipkinFetch({ remote }, { url, method })
    .then(async ({ body, request }) => {
      ctx.state.meters
        .totalUpstreamRequests
        .labels(method, remote, cacheHit(request))
        .inc(1)

      ctx.trace('responsehandle', 'start')
      await wait(100)
      ctx.trace('responsehandle', 'hard process')
      await wait(200)
      ctx.trace('responsehandle', 'end')
      return body
    })

  ctx.trace('postprocess', 'start')
  await wait(450)
  ctx.trace('postprocess', 'finish')

  ctx.body = body
  ctx.status = 200
})

export default router
