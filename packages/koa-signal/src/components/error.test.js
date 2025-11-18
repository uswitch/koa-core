import error from './error'

describe(`koa-signal | error component`, () => {
  let ctx
  beforeEach(() => (ctx = { }))

  it(`should return the right format`, () => {
    expect(
      error({ label: 'success' })(ctx, new Error('Oh no something went wrong'))
    ).toContain('Error: Oh no something went wrong')
  })

  it('should work if you pass through the error as an original', () => {
    expect(
      error({ label: 'success' })(ctx, { original: new Error('Dang, it broke') })
    ).toContain('Error: Dang, it broke')
  })
})
