
import { basename } from 'path'
import format from '../helper/format'

/* Config and then passed Koa ctx & msg */
export default (config = {}) => (ctx) => {
  const { displayFileName = false } = config

  if (!displayFileName) return

  const temp = Error.prepareStackTrace

  Error.prepareStackTrace = (error, stack) => stack //eslint-disable-line
  const { stack } = new Error()

  Error.prepareStackTrace = temp

  const callers = stack.map(i => i.getFileName())
  const caller = callers.find(i => i && !i.includes('/koa-signal/'))

  return format(config, caller ? basename(caller) : 'anonymous')
}
