import format from '../helper/format'

export default (config = { }) => (ctx) => {
  const { minimumWidth = 10, alignment = 'right' } = config
  const { initDiff } = ctx

  const padF = alignment === 'right' ? 'padStart' : 'padEnd'
  return format(config, `+${initDiff}ms`[padF](minimumWidth))
}
