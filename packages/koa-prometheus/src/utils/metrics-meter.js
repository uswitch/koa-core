import { camelCase } from './s'

export const isMetricsMeter = ({ type }) => [ 'Meter' ].includes(type)
export const printMeter = (meters) => (config) => {
  const { name, alias, help } = config
  const meter = meters[camelCase(alias || name)]

  return `# HELP ${help}
# TYPE ${name} gauge
${name}{decay="1"} ${meter.oneMinuteRate()}
${name}{decay="5"} ${meter.fiveMinuteRate()}
${name}{decay="15"} ${meter.fifteenMinuteRate()} `
}

export default (config, meters) => config.filter(isMetricsMeter).map(printMeter(meters))
