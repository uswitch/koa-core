import { path } from './obj'
import { camelCase } from './s'

const markFunction = ({ name, mark, labelNames = [] }) => (ctx, scopeId) => {
  if (!mark) return
  if (mark.id && scopeId !== mark.id) return

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

export const buildMarker = (config = []) => (ctx = {}) => config
  .map(markFunction)
  .forEach(f => f(ctx))

export const buildScopedMarker = (config = []) =>
  (scopeId, ctx = {}) => config
    .map(markFunction)
    .forEach(f => f(ctx, scopeId))
