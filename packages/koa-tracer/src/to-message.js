import { bold } from 'chalk'
import { isError, isObject, isProduction, showErrorTrace } from './helper-predicates'

/* Convert object into a pretty stringified log message */
const toMessage = (obj) => Object.entries(obj).map(([ key, val ]) => `${bold(key)}:${isObject(val) ? JSON.stringify(val) : val}`).join(' ')

export default (obj) => {
  if (isError(obj)) {
    obj = showErrorTrace()
      ? { ...obj, msg: obj.message, trace: obj.trace }
      : { ...obj, msg: obj.message }
  }

  if (isObject(obj) && !isProduction()) return { msg: toMessage(obj) }
  if (isObject(obj) && isProduction()) return obj

  return { msg: obj }
}
