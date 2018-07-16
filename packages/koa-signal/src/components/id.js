import format from '../helper/format'
import shorten from '../helper/shorten'

/* Config and then passed Koa ctx & msg */
export default (config = { }) => ({ state = {} } = {}) => {
  const { displayShortId = false, defaultReturn, configArg } = config
  const id = state[configArg || 'id'] || ''

  if (!id) return format(config, defaultReturn)

  const length = isNaN(+displayShortId) || displayShortId === true ? 10 : +displayShortId
  return format(config, displayShortId ? shorten(id, length) : id)
}
