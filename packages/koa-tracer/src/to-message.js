import { isError, isObject, isProduction, showErrorTrace } from './helper-predicates'

/* Convert object into a pretty stringified log message */
const toMessage = (obj) => Object.entries(obj).map(([ key, val ]) => val ? `${key}:${val}` : '').join(' ')

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
