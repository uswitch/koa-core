const { dependencies } = require('../package.json')
const { exec } = require('child_process')
const execAsync = cmd => new Promise((resolve, reject) => exec(cmd, (err, out) => err ? reject(err) : resolve(out)))

const updates = Object
      .keys(dependencies)
      .filter((dep) => dep.startsWith('@uswitch'))
      .map((dep) => `npm update ${dep}`)

console.log(`Beginning updates of ${updates.length} packages`)
Promise
  .all(updates.map(execAsync))
  .then((out) => {
    console.log('Updates successful!')
    console.log(out)
  })
