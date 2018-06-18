import format from '../helper/format'
import modify from '../helper/text-modifier'
import join from '../helper/safe-join'

/* Config and then passed Koa ctx & msg */
export default (config = {}) => (ctx) => {
  const { label, labelColor, badge = '' } = config
  const formatConfig = { ...config, color: labelColor }

  const displayText = join([ badge, modify(config, label) ])
  return format(formatConfig, displayText)
}
