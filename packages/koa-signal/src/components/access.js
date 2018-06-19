import format from '../helper/format'
import modify from '../helper/text-modifier'
import join from '../helper/safe-join'

/* Config and then passed Koa ctx & msg */
export default (config = {}) => ({ req = {}, res = {} }) => {
  const { statusMap, displayMethod = false, displayStatus = true } = config

  const { method } = req
  const { statusCode } = res

  const predicates = Object
    .entries(statusMap)
    .map(([key, val]) => [ key.split('-'), val ])
    .map(([[ lower, upper ], val]) => upper
      ? [it => it >= +lower && it < upper, val]
      : [it => it === +lower, val]
    )

  const [, { color, badge } = {}] = predicates.find(([f]) => f(statusCode)) || []

  const text = join([ displayStatus && statusCode, displayMethod && method ])
  const displayText = join([ '', badge, modify(config, text) ])

  return format({ ...config, color: color || config.color }, displayText)
}
