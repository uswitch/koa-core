import requireDirectory from 'require-directory'
const componentMap = requireDirectory(module, './components')

export const buildComponent = ({ components, levels }, level, format) => format
  .map(component => {
    if (component.startsWith('just:')) return () => component.replace('just:', '')

    const componentF = componentMap[component]
    const componentConfig = components[component]
    const levelConfig = levels[level]

    const config = { ...levelConfig, ...componentConfig }
    if (process.env.DEBUG) console.log(level, component, config)

    return componentF && componentF.default({ label: level, ...config })
  })
  .filter(i => i)
