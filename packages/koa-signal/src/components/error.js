import pc from 'picocolors'

/* Config and then passed Koa ctx & msg */
export default (config = {}) => (ctx, error = {}) => {
  const {
    displayStackTrace = true,
    displayFullStackTrace = false,
    color = 'grey'
  } = config

  if (!(error instanceof Error) && !(error.original instanceof Error)) return

  const errorInst = error instanceof Error ? error : error.original

  const [ head, ...tail ] = errorInst.stack.split(/\n/)
  const stack = !displayFullStackTrace
    ? tail.filter(i => !i.includes('node_modules'))
    : tail

  return displayStackTrace
    ? [ head, ...stack.map(it => pc[color](it)).map(i => i.replace(/^/, '\n')) ]
    : head
}
