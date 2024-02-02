import { groupBy } from './arr'
import { path } from './obj'
import { camelCase } from './s'

const markFunction = ({ name, mark, labelNames = [] }) => ctx => {
  if (!mark) return

  const id = camelCase(name)

  const meter = ctx.state.meters[id]
  const amount = mark.path ? path(mark.path, ctx) : mark.amount



  const labels = labelNames.map(({ key, path: p }) => {
    const result = path(p, ctx)

    if (result === undefined && process.env.DEBUG_KOA) console.error(`Could not find label: ${key} -> ${p}`)

    return result
  })

  if (!meter && process.env.DEBUG_KOA) console.error(`Could not find meter: ${id}`)
  if (!amount && process.env.DEBUG_KOA) console.error(`Could not read amount from: ${mark.path}`)
  if (!meter || !amount) return

  if (labels.length && labels.filter(i => i).length !== labels.length) return

  labels.length
    ? meter.labels(...labels)[mark.method](amount)
    : meter[mark.method](amount)
}

const automarkFunction = (meters) => (ctx) => meters
  .map(markFunction)
  .forEach(f => f(ctx))

export default (config = []) => {
  const automarkMeters = config.filter(({ mark }) => !!mark)
  const groupedMeters = groupBy(automarkMeters, ({ mark }) => mark.id)

  if (process.env.DEBUG_KOA) console.log(`GROUPED METERS:`, groupedMeters)

  const automark = Object
    .entries(groupedMeters)
    .reduce(
      (acc, [ id, meters ]) => Object.assign(acc, { [id]: automarkFunction(meters) }),
      automarkFunction(groupedMeters.default)
    )

  if (process.env.DEBUG_KOA) console.log(`AUTOMARK:`, automark)

  return automark
}
