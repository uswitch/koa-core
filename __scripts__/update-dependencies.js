const { dependencies } = require('../package.json')
const { exec } = require('child_process')
const execAsync = cmd => new Promise((resolve, reject) => exec(cmd, (err, out) => err ? reject(err) : resolve(out)))

const updates = Object
  .keys(dependencies)
  .filter((dep) => dep.startsWith('@uswitch'))
  .map((dep) => `npm update ${dep}`)

console.log(`Beginning updates of ${updates.length} non '@uswitch' packages`)
Promise
  .all(updates.map(execAsync))
  .then((out) => {
    console.log(`Updated ${out.length} packages successfully!`)
    console.log(out)
  })

console.log(`Beginning updates of '@uswitch' packages`)

execAsync('npx lerna ls --json')
  .then((json) => {
    Promise.all(
      JSON
        .parse(json)
        .map(({ name, version }) => `npm install ${name}@${version}`)
        .map(execAsync)
    ).then(out => console.log(`Updated '@uswitch' packages successfuly!`))
  })
  .catch(e => console.error(e))
