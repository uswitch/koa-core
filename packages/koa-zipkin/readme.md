<h1 align="center">🤐 Koa Zipkin</h1>

<p align="center">
  <i>
    A <b><a href="http://koajs.com">Koa</a></b> middleware for
    wiring into <code>zipkin.js</code>
  </i>
</p>

<p align="center">
  <b><a href="#overview">Overview</a></b>
  |
  <b><a href="#usage">Usage</a></b>
  |
  <b><a href="#api">Api</a></b>
</p>


<p align="center">
  <img src="screenshot.png" width="800">
</p>

[![Contributors](https://img.shields.io/badge/contributors-1-orange.svg?style=for-the-badge)](#contributors)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)]()
![type](https://img.shields.io/badge/⚡-library-c45366.svg?style=for-the-badge)
![language](https://img.shields.io/badge/❤-Node-da776c.svg?style=for-the-badge)
[![test](https://img.shields.io/badge/🔬-Jest-e9a279.svg?style=for-the-badge)](https://facebook.github.io/jest/)
[![style](https://img.shields.io/badge/🎨-Standard-e4ca93.svg?style=for-the-badge)](https://standardjs.com)

## Overview

This package is a [**Koa**](http://koajs.com) library to do a lot of
the heavy lifting to enable `zipkin` tracing around your service and
of upstream requests within your app.

It tries to encapsulate some of the _run time_ mentality of how you
build a service with the _compile time_ integration of `zipkin.js**
libraries and instrumentations.

---

**_N.B._** - This library is _opinionated_. It provides;

+ Instrumentation for [`fetch`](https://github.com/openzipkin/zipkin-js/tree/master/packages/zipkin-instrumentation-fetch)
+ A HTTP / Client side logger designed to work with [`@uswitch/koa-signal`](https://github.com/uswitch/koa-core/tree/master/packages/koa-signal)

## Usage


### Using a fetch client without a cache

This is the simplest way to get zipkin tracing working with a koa
application and sending to a Zipkin server.

```js
// Define a module `zipkin.js`

import { middleware, fetch, Logger, Tracer } from '@uswitch/koa-zipkin'
import fetch from 'node-fetch'

const { middleware, fetch, Logger, Tracer } = koaZipkin
const { NODE_ENV, ZIPKIN_HOST, APP_NAME = 'example-service' } = process.env

const logger = Logger({ local: NODE_ENV === 'development', endpoint: ZIPKIN_HOST })
const tracer = Tracer(APP_NAME, logger)

export const zipkin = middleware({ tracer })
export const zipkinFetch = fetch({ local: APP_NAME, client: fetch, tracer })

// ----------------------------------------
// Then in your `koa` server you can just use
import { zipkin, zipkinFetch } from './zipkin'

app.use(zipkin)

app.use((ctx, next) => zipkinFetch({ remote: 'my-upstream' }, 'http://my-upstream'))
```

### Using axios with a cache

Similarly to above, there are some benefits to using `axios` with its
cache adapter. You get added logging of cache hits and misses as well
as the zipkin tracing. However, this needs a few extra bits like
adding the `X-Cache-Enabled:true` header to your responses.

```js
// Define a module `zipkin.js`
import koaZipkin from '@uswitch/koa-zipkin'

import axios from 'axios'
import cache from 'axios-cache-adapter'

const { middleware, fetch, Logger, Tracer } = koaZipkin
const { USE_CACHE = true, NODE_ENV, APP_NAME = 'example-uf-service' } = process.env

const { adapter } = cache.setupCache({ maxAge: USE_CACHE ? 10 * 1000 : 0 })
const client = axios.create({ adapter })

/* Mark the intent of using a cache */
client.interceptors.response.use(
  (res) => {
    res.headers['X-Cache-Enabled'] = true
    return res
  },
  Promise.reject
)

const tracer = Tracer(APP_NAME, Logger({ local: NODE_ENV === 'development' }))

export const zipkin = middleware({ tracer })
export const zipkinFetch = fetch({ local: APP_NAME, client, tracer })
```

### Enabling experimental ContextCLS feature to support tracing through code with promises / async / await

Please see https://github.com/openzipkin/zipkin-js/tree/master/packages/zipkin-context-cls#a-note-on-cls-context-and-promises, and note that by default - asynchronous code is not supported by ContextCLS. If you see fetches appearing in Zipkin with a different Trace ID, this could be the reason..

To enable asynchronous ContextCLS, create the Tracer object as follows:

```js
const tracer = Tracer(APP_NAME, logger, true)
```

**Please also note there are known performance implications of enabling this feature on Node versions below 16.3.0**
