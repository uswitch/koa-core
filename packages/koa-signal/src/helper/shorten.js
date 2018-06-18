export default (s = '', trim = 10) => {
  if (s.length <= trim) return s

  const toShow = trim - 3
  const front = s.slice(0, Math.ceil(toShow / 2))
  const back = s.slice(-Math.floor(toShow / 2))

  return front + '...' + back
}
