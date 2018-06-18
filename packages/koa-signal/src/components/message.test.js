/* global describe, it, expect */
import message from './message'

describe(`koa-signal | message component`, () => {
  it(`should return the right format`, () => {
    expect(message()('Foooo')).toEqual('Foooo')
  })

  it(`should read the 'message' property`, () => {
    expect(message()({ message: 'Baaar' })).toEqual('Baaar')
  })

  it(`should read the 'msg' property`, () => {
    expect(message()({ msg: 'Baaar' })).toEqual('Baaar')
  })

  it(`should read the 'text' property`, () => {
    expect(message()({ text: 'Baaar' })).toEqual('Baaar')
  })

  it(`should read a customer propety defined in config`, () => {
    expect(message({ properties: [ 'my-custom-id' ] })({ 'my-custom-id': 'blacksheep' }))
      .toEqual('blacksheep')
  })

  it('should log out an object when passed as a seacond object', () => {
    expect(message()({}, { a: 1, b: 2, c: 'baaaar!' })).toEqual(['a: 1', 'b: 2', 'c: baaaar!'])
  })
})
