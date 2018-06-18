import format from '../helper/format'

/* Config and then passed Koa ctx & msg */
export default (config = {}) => (ctx) => {
  const { label, badge = '' } = config
  return format(config, [ badge, label ].filter(i => i).join(' '))
}
