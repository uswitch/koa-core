import format from '../helper/format'
import shorten from '../helper/shorten'

/* Config and then passed Koa ctx & msg */
export default (config = { }) => (ctx) => {
  const { displayShortId = false } = config
  const { id = '' } = ctx.state

  const length = isNaN(+displayShortId) || displayShortId === true ? 10 : +displayShortId
  return format(config, displayShortId ? shorten(id, length) : id)
}
