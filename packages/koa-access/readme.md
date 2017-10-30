<h1 align="center">Koa Logger</h1>

<p align="center">
  <i>
    A <b><a href="http://koajs.com">Koa</a></b> middleware for
    creating <b>consistent</b>, <b>per-request</b> access logs for your requests.
  </i>
</p>

<p align="center">
  <b><a href="#overview">Overview</a></b>
  |
  <b><a href="#usage">Usage</a></b>
  |
  <b><a href="#api">Api</a></b>
</p>

## Overview

This package is a [**Koa**](http://koajs.com/) middleware inspired by
[**Morgan**](https://github.com/expressjs/morgan), an **access log**
middleware for **Express**.

It tries to address the following;

* 🖌 **Custom formatting** - Allow you to inject your own formatting
* 💰 **Custom tokens** - Allow you to add your own extra logging tokens
* 📓 **JSON tokens** - All of this is handled using JSON rather than strings

All of this allows you to create **consistent** access logs decoupled
from the actual implementation of your code.

---

### Usage

```js
import Koa from 'koa'
import logger from 'koa-logger'

const app = new Koa()

app.use(logger())           /* Default configuration */
app.use(logger([ 'id' ]))   /* Add `id` from `ctx.state` to access log */

app.use(logger(readContext)) /* Read extra poperties by calling `readContext` on `ctx` */

app.on('koa-logger:access', Logger.log)
```

This package uses [**Event
Emitters**](https://nodejs.org/api/events.html) to decouple the
handling of logging from the implementation of your code.

### API

By default, the `koa-logger` will bundle the following properties into
an object and fire them on the the `koa-logger:access` event.

```js
{
  "res": {
    "responseTime": 23    // Response time in `ms`
    "length": 23232       // Content length of the response
    "status": 200         // Response status
    "time": "2017-..."    // Timestamp of the response
  },
  "req": {
    "method": "GET"       // Method of request
    "path": "/foo/bar"    // Path being accessed
    "time": "2017-..."    // Timestamp of request start
    "host": "127.0.0.1"   // Host of the request
  }
}
```

The `koa-logger` can be **configured** with _extra_ parameters in one
of two ways,

#### Array - `logger([ 'id', 'errors' ])`

This will add the `id` and `errors` properties from the **Koa**
`ctx.state` object onto the access log object.

#### Function - `logger((ctx) => ({ id: ctx.state.id, errors: ctx.state.errors }))`

This will return an object by calling the function on **Koa's** `ctx`
object, in this example, it'll just grab the `id` and `errors`
properties from the state.

#### Events

Once a request access log has been built, the following event is fired
with the access object

`koa-logger:access => ({ req, res, ...extras })`

The event can be imported from the `koa-logger` module, as

```js
import { eventAccess } from 'koa-logger
```

