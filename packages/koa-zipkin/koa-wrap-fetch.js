export default (fetch, { tracer }) => {
  return (input, opts = {}) => new Promise((resolve, reject) => {
    const url = typeof input === 'string'
      ? input
      : input.url

    fetch(url, opts)
      .then((res) => {
        const { request = {}, headers = {} } = res
        if (headers['X-Cache-Enabled'] !== true) return resolve(res)

        const hit = request.fromCache === true ? 'HIT' : 'MISS'
        tracer.setTags({ 'http.cache': hit })

        return resolve(res)
      })
      .catch(reject)
  })
}
