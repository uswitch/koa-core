const { resolve } = require('path')
const { writeFileSync, readFileSync } = require('fs')

const npmUrl = name =>
      `https://www.npmjs.com/package/${name}`
const npmBadge = name =>
      `[\`${name}\`](${npmUrl(name)})`
const versionBadge = name =>
      `[![npm](https://img.shields.io/npm/v/${name}.svg?maxAge=2592000)](${npmUrl(name)})`

const { dependencies } = require('../package.json')
const passThrough = Object
      .entries(dependencies)
      .filter(([dep]) => dep.startsWith('koa'))
      .map(([dep, version]) => [npmBadge(dep), '`' + version + '`', versionBadge(dep)])

const row = (arr) => '| ' + arr.join(' | ') + ' |'
const table = `<!-- [doc-list-packages:start] -->
| Package | Version | Latest |
|--|--|--|
${passThrough.map(row).join('\n')}
<!-- [doc-list-packages:end] -->`

const readmePath = resolve(__dirname, '../README.md')
const readme = readFileSync(readmePath, 'utf-8')
const updated = readme.replace(/.*\[doc-list-packages:start\].*[\s\S]*\[doc-list-packages:end\].*/, table)
writeFileSync(readmePath, updated)
