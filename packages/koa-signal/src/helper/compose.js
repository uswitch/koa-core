export default (...fs) => (...init) => fs.reduceRight((acc, it) => it(...acc), init)
