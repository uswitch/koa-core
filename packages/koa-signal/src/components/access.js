import format from '../helper/format'
import modify from '../helper/text-modifier'

/* Config and then passed Koa ctx & msg */
export default (config = {}) => ({ req = {}, res = {} }) => {
  const { statusMap } = config

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
  const displayText = [ badge, modify(config, statusCode + ' ' + method) ]
    .filter(i => i)
    .join(' ')

  return format({ color }, displayText)
}
