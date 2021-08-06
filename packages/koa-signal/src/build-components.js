import componentMap from './components'

export const buildComponent = ({ components, levels }, level, format) => format
  .map(component => {
    if (component.startsWith('just:')) return () => component.replace('just:', '')

    const [componentKey, configArg] = component.split(':')

    const levelConfig = levels[level]
    const levelComponent = (levelConfig.components || {})[componentKey]

    const componentF = componentMap[componentKey]
    const componentConfig = { ...components[componentKey], ...levelComponent, configArg }

    const config = { ...levelConfig, ...componentConfig }
    if (process.env.DEBUG_KOA_SIGNAL) console.log(level, component, config)

    return componentF && componentF({ label: level, ...config })
  })
  .filter(i => i)
