import fileName from './file-name'

describe(`koa-signal | file-name component`, () => {
  let ctx
  beforeEach(() => (ctx = { }))

  it(`should default to not showing the file name`, () => {
    expect(fileName({})(ctx)).not.toBeDefined()
  })

  it(`should return the file name not from 'koa-signal'`, () => {
    expect(fileName({ displayFileName: true })()).not.toEqual('file-name.js')
  })
})
