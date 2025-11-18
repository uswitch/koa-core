import Signal from './koa-signal'

const signal = Signal()

describe(`koa-signal`, () => {
  it(`should return the default functions format`, () => {
    const fs = Object
      .entries(signal)
      .filter(([_, f]) => typeof f === 'function')
      .map(([id]) => id)

    expect(fs).toContain('info')
    expect(fs).toContain('trace')
  })
})
