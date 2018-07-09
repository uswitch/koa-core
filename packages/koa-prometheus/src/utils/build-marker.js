import { path } from './obj'
import { camelCase } from './s'

const markFunction = ({ name, mark, labelNames = [] }) => ctx => {
  const id = camelCase(name)

  const meter = ctx.state.meters[id]
  const amount = mark.path ? path(mark.path, ctx) : mark.amount
  const labels = labelNames.map(({ key, path: p }) => path(p, ctx))

  if (!meter && process.env.DEBUG_KOA) throw new Error(`Could not find meter: ${id}`)
  if (!amount && process.env.DEBUG_KOA) throw new Error(`Could not read amount from: ${mark.path}`)
  if (!meter || !amount) return

  console.log(ctx)

  if (labels.length && labels.filter(i => i).length !== labels.length) return

  labels.length
    ? meter.labels(...labels)[mark.method](amount)
    : meter[mark.method](amount)
}

export default (config = []) => (ctx = {}) => config
  .map(markFunction)
  .forEach(f => f(ctx))
