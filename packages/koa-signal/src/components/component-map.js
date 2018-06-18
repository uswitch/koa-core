import requireDirectory from 'require-directory'
const COMPONENT_MAP = requireDirectory(module)

export const buildComponent = ({ components, levels }, level, format) => format
  .map(component => {
    if (component.startsWith('just:')) return () => component.replace('just:', '')

    const componentF = COMPONENT_MAP[component].default
    const componentConfig = components[component]
    const levelConfig = levels[level]

    const config = { ...levelConfig, ...componentConfig }
    if (process.env.DEBUG) console.log(level, component, config)

    return componentF && componentF({ label: level, ...config })
  })
  .filter(i => i)
