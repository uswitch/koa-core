import format from '../helper/format'
import modify from '../helper/text-modifier'

/* Config and then passed Koa ctx & msg */
export default (config = {}) => (ctx) => {
  const { label, labelColor, badge = '' } = config
  const formatConfig = { ...config, color: labelColor }

  const displayText = [ badge, modify(config, label) ].filter(i => i).join(' ')
  return format(formatConfig, displayText)
}
