import format from '../helper/format'

export default (config = { }) => (ctx) => {
  const { minimumWidth = 6, alignment = 'right' } = config
  const { timeDiff } = ctx

  const padF = alignment === 'right' ? 'padStart' : 'padEnd'
  return format(config, `+${timeDiff}ms`[padF](minimumWidth))
}
