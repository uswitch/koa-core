import format from '../helper/format'

export default (config = { }) => (ctx) => {
  const { minimumWidth = 10, alignment = 'right', defaultReturn } = config
  const { initDiff } = ctx
  const padF = alignment === 'right' ? 'padStart' : 'padEnd'

  if (!initDiff) return defaultReturn && format(config, defaultReturn[padF](minimumWidth))

  return format(config, `${+initDiff > 0 ? '+' : ''}${initDiff}ms`[padF](minimumWidth))
}
