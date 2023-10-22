const axios = require('axios')
const jwt = require('jsonwebtoken')

const setExperiences = expToken => expToken ? jwt.decode(expToken) : {}

exports.experiences = ({ url, timeout = 1000 }) => async (ctx, next) => {
  const { headers } = ctx

  if (headers['X-Skip-Experiences']) {
    ctx.experiences = {}
    return next()
  }

  const userId = ctx.experienceId || headers['x-uscc-got'] || headers['x-uscc-set']
  ctx.userId = ctx.userId || (userId && userId.split('=').pop()) || 'default'

  try {
    if (headers['rvu-experiences']) {
      ctx.experiences = setExperiences(headers['rvu-experiences'])
      return next()
    }

    if (url === 'DISABLED' || process.env.CHANSEY_DISABLED) {
      ctx.experiences = {}
      return next()
    }

    const res = await axios(`${url}/experiences?key=${ctx.userId}`, {
      headers: {
        'Original-Path': ctx.path,
        ...(ctx?.cookie?.usca ? {cookie: `usca=${ctx.cookie.usca}`} : {})
      },
      timeout
    })
    ctx.experiences = setExperiences(res.headers['rvu-experiences'])
    if (res.headers['rvu-personalisation']) {
      ctx.personalisation = res.headers['rvu-personalisation']
    }
  } catch (error) {
    ctx.experiences = {}
  }

  return next()
}

exports.cohort = require('./cohort')
