import format from '../helper/format'

export default (config = { }) => (ctx) => {
  const { minimumWidth = 6, alignment = 'right', defaultReturn } = config
  const { timeDiff } = ctx
  const padF = alignment === 'right' ? 'padStart' : 'padEnd'

  if (!timeDiff) return defaultReturn && format(config, defaultReturn[padF](minimumWidth))

  return format(config, `+${timeDiff}ms`[padF](minimumWidth))
}
