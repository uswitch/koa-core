const { resolve } = require('path')
const { writeFile } = require('fs')
const writeFileAsync = ([name, contents]) => new Promise((resolve, reject) => {
  writeFile(name, contents, (err, res) => err ? reject(err) : resolve(res))
})

const { dependencies } = require('../package.json')
const passThrough = Object
      .keys(dependencies)
      .filter((dep) => dep.startsWith('koa'))
      .map((dep) => [
        resolve(__dirname, `../${dep}.js`),
        `module.exports = require('${dep}')\n`
      ])

console.log(`Building ${passThrough.length} dependencies`)
Promise
  .all(passThrough.map(writeFileAsync))
  .then(() => {
    console.log('Dependencies built!')
  })
