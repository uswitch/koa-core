import pc from 'picocolors'

export default (config = {}, text) => [
  config.uppercase && ((s = '') => s.toUpperCase()),
  config.underline && ((s = '') => pc.underline(s)),
  config.italic && ((s = '') => pc.italic(s))
].reduce((acc, it) => it ? it(acc) : acc, text)
