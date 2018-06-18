import chalk from 'chalk'

/* Config and then passed Koa ctx & msg */
export default (config = {}) => (ctx, error) => {
  const {
    displayStackTrace = true,
    displayFullStackTrace = false,
    color = 'grey'
  } = config

  if (!(error instanceof Error)) return

  const [ head, ...tail ] = error.stack.split(/\n/)
  const stack = !displayFullStackTrace
    ? tail.filter(i => !i.includes('node_modules'))
    : tail

  return displayStackTrace
    ? [ head, ...stack.map(it => chalk[color](it)).map(i => i.replace(/^/, '\n')) ]
    : head
}
