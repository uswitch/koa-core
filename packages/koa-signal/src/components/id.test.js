/* global describe, beforeEach, it, expect */
import id from './id'

describe(`koa-signal | id component`, () => {
  let ctx
  beforeEach(() => (ctx = { state: { id: '1234567890' } }))

  it(`should return the right format`, () => {
    expect(id({})(ctx)).toEqual('1234567890')
  })

  it('should return the shortened version', () => {
    expect(id({ displayShortId: 8 })(ctx)).toEqual('123...90')
  })

  it('should not shorten it if the id is longer', () => {
    expect(id({ displayShortId: 10 })(ctx)).toEqual('1234567890')
    expect(id({ displayShortId: 12 })(ctx)).toEqual('1234567890')
  })

  it('should default to a length of 10 if `displayShortId` is NaN', () => {
    expect(id({ displayShortId: true })(ctx)).toEqual('1234567890')
  })

  it('should work with the `displayFormat` param', () => {
    expect(id({ displayFormat: ' << %s >> ' })(ctx)).toMatch(/^ << /)
    expect(id({ displayFormat: ' << %s >> ' })(ctx)).toMatch(/ >> $/)
  })

  it('should return undefined if no id is present', () => {
    expect(id({})()).not.toBeDefined()
  })

  it('should return the \'defaultReturn\' if id is not present ', () => {
    expect(id({ defaultReturn: 'NOID!!' })()).toEqual('NOID!!')
  })

  it('should return the correctly formatted \'defaultReturn\' if no id is present', () => {
    expect(id({ defaultReturn: 'no_id', displayFormat: '[%s]' })()).toEqual('[no_id]')
  })
})
