export default (arr, joiner = ' ') => arr.filter(i => typeof i === 'string' || i).join(joiner)
