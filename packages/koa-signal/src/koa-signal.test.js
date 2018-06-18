/* global describe, it, expect, jest */
import Signal from './koa-signal'

const signal = Signal()
const capture = (f) => () => {
  const mock = jest.fn()
  const _ = console.log
  console.log = mock
  f(mock)
  console.log = _
}

describe(`koa-signal`, () => {
  it(`should return the default functions format`, () => {
    const fs = Object
      .entries(signal)
      .filter(([_, f]) => typeof f === 'function')
      .map(([id]) => id)

    expect(fs).toContain('info')
    expect(fs).toContain('trace')
  })

  describe(`| info function`, function () {
    it(`should log the correct format `, capture((mock) => {
      signal.info({ state: { id: '1234' } })
      expect(mock).toBeCalledWith('[1234] Ⓘ info')
    }))
  })
})
