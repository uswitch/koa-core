import format from '../helper/format'

/* Config and then passed Koa ctx & msg */
export default (config = {}) => (ctx) => {
  const { label, labelColor, badge = '' } = config
  const formatConfig = { ...config, color: labelColor }
  return format(formatConfig, [ badge, label ].filter(i => i).join(' '))
}
