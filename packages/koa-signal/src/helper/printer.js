import console from '../outputs/console'
import file from '../outputs/file'
import flatten from './flatten'

const OUTPUT_HANDLERS = {
  console,
  file
}

export default ({ separator = ' ', outputs = [] } = {}) => {
  const outputHandlers = outputs.map(cfg => {
    const handler = OUTPUT_HANDLERS[cfg.type];

    if (!handler) {
      throw new Error(`Unknown output type: ${cfg.type}. Supported values: ${Object.keys(OUTPUT_HANDLERS).join(', ')}`);
    }

    return handler(cfg);
  });

  return (...inputs) => {
    const printable = flatten(inputs)
    const message = printable.filter(i => i).join(separator)

    if (!message.trim()) return

    outputHandlers.forEach(handler => handler(message))
  }
}
