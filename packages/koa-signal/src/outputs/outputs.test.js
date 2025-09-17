/* global describe, it, expect, jest */
import Signal from '../koa-signal'

describe(`koa-signal | outputs`, () => {
  it(`should throw when an invalid output type is defined`, () => {
    expect(() => {
      new Signal({
        outputs: [
          { type: 'invalid-output-type' }
        ]
      })
    }).toThrow()
  })
})