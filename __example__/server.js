import KoaCore from '../koa-core.js'
import requestId from 'koa-requestid'

import { zipkin } from './zipkin.js'
import router from './server-router.js'

const { app, signal } = KoaCore()

app.use(zipkin)
app.use(requestId())
app.use(router.routes())

app.listen(3000, () => {
  signal.start('Listening on port 3000')
})
