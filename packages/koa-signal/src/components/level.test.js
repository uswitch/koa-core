/* global describe, beforeEach, it, expect */
import level from './level'

describe(`koa-signal | level component`, () => {
  let ctx
  beforeEach(() => (ctx = { }))

  it(`should return the right format`, () => {
    expect(level({ label: 'success' })(ctx)).toEqual('  success')
  })

  it(`should add a badge if provided`, () => {
    expect(level({ label: 'success', badge: '!' })(ctx)).toEqual(' ! success')
  })
})
