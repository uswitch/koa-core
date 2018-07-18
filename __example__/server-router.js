import Router from 'koa-router'
import wait from './wait'

import Signal from '@uswitch/koa-signal'
const signal = Signal()

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

router.get('/signal/all', async ctx => {
  /* Signal examples */
  signal.success('This is a success message!')
  signal.info('This is an info message')
  signal.warn('This is a warning message')
  signal.error('Error message', new Error('This is an error'))

  ctx.status = 200
})

export default router
