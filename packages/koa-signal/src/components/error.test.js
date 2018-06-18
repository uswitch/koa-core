/* global describe, beforeEach, it, expect */
import error from './error'

describe(`koa-signal | error component`, () => {
  let ctx
  beforeEach(() => (ctx = { }))

  it(`should return the right format`, () => {
    expect(
      error({ label: 'success' })(ctx, new Error('Oh no something went wrong'))
    ).toContain('Error: Oh no something went wrong')
  })
})
