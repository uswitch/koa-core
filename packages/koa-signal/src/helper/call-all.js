export default (fs) => (...input) => fs.map(f => f(...input))
