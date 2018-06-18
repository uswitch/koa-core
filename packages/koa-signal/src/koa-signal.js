import defaults from './koa-signal.defaults.json'
import { buildComponent } from './components/component-map'

import printer from './helper/printer'
import compose from './helper/compose'
import callAll from './helper/call-all'

import merge from './helper/merge'

export default (opts = {}) => {
  const components = merge(defaults.components, opts.components)
  const levels = merge(defaults.levels, opts.levels)

  const config = { levels, components }

  if (process.env.DEBUG) console.info(config)

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
