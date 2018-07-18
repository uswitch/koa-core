const { resolve } = require('path')
const { writeFileSync, readFileSync } = require('fs')
const { exec } = require('child_process')

const cmd = 'npm run --silent ls -- --json'
const getDescription = p => require(`${__dirname}/../packages/${p}/package.json`).description

const npmUrl = name =>
  `https://www.npmjs.com/package/${name}`
const npmBadge = name =>
  `[\`${name}\`](${npmUrl(name)})`
const versionBadge = name =>
  `[![npm](https://img.shields.io/npm/v/${name}.svg?maxAge=2592000)](${npmUrl(name)})`
const dependencyBadge = name =>
  `[![Dependency Status](https://david-dm.org/${name}.svg?path=packages/${name})](https://david-dm.org/${name}?path=packages/${name})`

exec(cmd, (err, data) => {
  if (err) return console.error(err)

  const json = JSON.parse(data)
  const packages = json
    .filter(({ name }) => name !== '@uswitch/koa-core')
    .map(({ name, version }) => [name, name.split('/'), version])
    .map(([p, [ _, name ], version]) => [p, getDescription(name), version])
    .map(([ name, description, version ]) => [ npmBadge(name), versionBadge(name), dependencyBadge(name), description ])

  const row = (arr) => '| ' + arr.join(' | ') + ' |'
  const table = `<!-- [doc-list-packages-internal:start] -->
<!-- Generated ${new Date()} -->
| Package | Version | Dependencies | Description |
|--|--|--|--|
${packages.map(row).join('\n')}
<!-- [doc-list-packages-internal:end] -->`

  const readmePath = resolve(__dirname, '../README.md')
  const readme = readFileSync(readmePath, 'utf-8')
  const updated = readme.replace(/.*\[doc-list-packages-internal:start\].*[\s\S]*\[doc-list-packages-internal:end\].*/, table)
  writeFileSync(readmePath, updated)
})
