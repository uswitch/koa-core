import defaults from './koa-signal.defaults.json'
import { buildComponent } from './build-components'

import printer from './helper/printer'
import compose from './helper/compose'
import callAll from './helper/call-all'

import merge from './helper/merge'

export default (opts = {}) => {
  const { loadDefaults = true } = opts

  const components = loadDefaults
    ? merge(defaults.components, opts.components)
    : opts.components

  const levels = loadDefaults
    ? merge(defaults.levels, opts.levels)
    : opts.levels

  const outputs = loadDefaults
    ? [...defaults.outputs, ...(opts.outputs || [])]
    : opts.outputs;

  const config = { levels, components, outputs }
  if (process.env.DEBUG_KOA_SIGNAL) console.info(config)

  return Object
    .entries(levels)
    .reduce((acc, [ level, { format } ]) => ({
      ...acc,
      [level]: compose(
        printer(config),
        callAll(buildComponent(config, level, format))
      )
    }), {})
}
