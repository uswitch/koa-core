export default (defaults = {}, configs = {}) => {
  const merged = Object
    .entries(defaults)
    .reduce((acc, [ key, conf ]) => ({
      ...acc,
      [key]: { ...conf, ...configs[key] }
    }), {})

  return { ...configs, ...merged }
}
