import { bold, red } from 'chalk'

import format from '../helper/format'
import flatten from '../helper/flatten'
import join from '../helper/safe-join'

export default (config = {}) => (ctx = {}, extras = {}) => {
  const { trace = {}, res = {}, errors } = extras
  const { responseTime } = res

  const numTraces = Object.keys(trace).length
  const timings = Object.entries(trace).map(([ key, o ]) => [ key, o.timeDiff ])

  const title = ` of request ${bold(ctx.state.id || '???')}`
  const strings = [
    numTraces > 0 && `There were ${bold(numTraces)} traces`,
    numTraces > 0 && timings.map(([ key, time ]) => `The ${bold(key)} segment took ${bold(time || 0)}ms`),
    responseTime && `The entire request took ${bold(responseTime)}ms`,
    errors.length > 0 && `${red(bold(errors.length))} errors occurred!`
  ]

  const joiner = '\n\t• '
  return format(ctx, title + joiner + join(flatten(strings), joiner) + '\n')
}
