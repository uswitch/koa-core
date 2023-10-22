/**
 * Returns the cohort for a specific flag, otherwise returns a default value.
 *
 * @param {Object} ctx - The Koa request context.
 * @param {string} name - The name of the flag.
 * @param {*} [fallback=null] - The default value to fallback to.
 * @returns {number|null}
 */


exports = module.exports = (ctx, name, fallback = null) => {
    const experiences = ctx.experiences || {}
    const experience = experiences[name]
  
    return experience ? experience.cohort : fallback
  }
  