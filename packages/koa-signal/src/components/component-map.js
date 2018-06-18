const COMPONENT_MAP = {
  'id': require('./id').default,
  'level': require('./level').default,
  'file-name': require('./file-name.js').default
}

export const buildComponent = ({ components, levels }, level, format) => format
  .map(component => {
    const componentF = COMPONENT_MAP[component]
    const componentConfig = components[component]
    const levelConfig = levels[level]

    const config = { ...levelConfig, ...componentConfig }
    if (process.env.DEBUG) console.log(level, component, config)

    return componentF && levelConfig && componentConfig && componentF({ label: level, ...config })
  })
  .filter(i => i)
