import format from '../helper/format'

/* Config and then passed Koa ctx & msg */
export default (config = {}) => ({ kind = '' }) => {
  const { clientIcon, serverIcon, clientFormat, serverFormat } = config
  const [ badge, displayFormat = config.displayFormat ] = kind.toLowerCase() === 'client'
    ? [ clientIcon, clientFormat ]
    : [ serverIcon, serverFormat ]

  const { labelColor } = config
  const formatConfig = { ...config, displayFormat, color: labelColor }

  return format(formatConfig, badge)
}
