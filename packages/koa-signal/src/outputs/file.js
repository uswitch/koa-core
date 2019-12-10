import { EOL } from 'os';
import { createWriteStream } from 'fs';

export default ({ file }) => {
  let writeStream;

  try {
    writeStream = createWriteStream(file)
  } catch (e) {
    throw new Error(`Error while creating write stream for "${file}": ${e.message}`)
  }

  return (msg) => writeStream.write(`${msg}${EOL}`)
}
