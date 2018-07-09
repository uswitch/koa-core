import { camelCase } from './s'

const print = ({help}, name, value) => `
# HELP ${help}
# TYPE ${name} gauge
${name} ${value}`

export const isMetricsMeter = ({ type }) => [ 'Meter' ].includes(type)
export const printMeter = (meters) => (config) => {
  const { name } = config
  const meter = meters[camelCase(name)]

  return `
${print(config, name + '_per_minute', meter.oneMinuteRate())}
${print(config, name + '_per_five_minutes', meter.fiveMinuteRate())}
${print(config, name + '_per_fifteen_minutes', meter.fifteenMinuteRate())} `
}

export default (config, meters) => config.filter(isMetricsMeter).map(printMeter(meters))
