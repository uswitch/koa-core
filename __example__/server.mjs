import KoaCore from '../koa-core'
import requestId from 'koa-requestid'

import { zipkin } from './zipkin'
import router from './server-router'

const { app, signal, meters } = KoaCore()

// Attach the prometheus meers for use in router
app.use((ctx, next) => next(ctx.state.meters = meters))

app.use(zipkin)
app.use(requestId())
app.use(router.routes())

app.listen(3000, () => {
  signal.start('Listening on port 3000')
})
