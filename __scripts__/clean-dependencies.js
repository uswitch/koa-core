const { resolve } = require('path')
const del = require('del')

const root = resolve(`${__dirname}/../koa*`)
const main = resolve(`${__dirname}/../koa-core.js`)

del([ root, `!${main}` ]).then(paths => {
  console.log(`Removed ${paths.length} pass through dependencies`)
  console.log(paths.join('\n'))
})
