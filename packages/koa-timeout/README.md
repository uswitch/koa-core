<h1 align="center">Koa Timeout</h1>

<p align="center">
  <i>
    A <b><a href="http://koajs.com">Koa</a></b> middleware to handle
  timeouts correctly
  </i>
</p>

<p align="center">
  <b><a href="#hot-it-works">How it works</a></b>
  |
  <b><a href="#usage">Usage</a></b>
</p>

[![Contributors](https://img.shields.io/badge/contributors-2-orange.svg?style=for-the-badge)](#contributors)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)]()
![type](https://img.shields.io/badge/⚡-library-c45366.svg?style=for-the-badge)
![language](https://img.shields.io/badge/❤-Node-da776c.svg?style=for-the-badge)
[![test](https://img.shields.io/badge/🔬-Jest-e9a279.svg?style=for-the-badge)](https://facebook.github.io/jest/)
[![style](https://img.shields.io/badge/🎨-Standard-e4ca93.svg?style=for-the-badge)](https://standardjs.com)

## How it works

`koa-timeout` uses
[`Promise.race`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
to race a `setTimeout` against your **Koa** middlewares/response.

#### Timeout example
```
Middlewares
              A 1s     B 2s       C 3s      D 4s
         ╭─────┴────────┴─────╳╌╌╌╌┴╌╌╌╌╌╌╌╌╌┴╌╌╌╌╌
Req ─────┤
         ╰────────────────────┬──→ 408 - 2500ms
                           Timeout
                             2.5s
```
In this example, a request has come in and the timeout is racing
middlewares, `A`, `B`, `C` & `D`. However, the timeout is triggered
causing a `408` response after `2500ms`.

The `╳` signifys a **short circuit** and prevents middlewares `C` &
`D` from running.


#### Successful example
```
Middlewares
              A 1s     B 2s      C 3s      D 4s
         ╭─────┴────────┴─────────┴─────────┴──────╮
         │                                         │
Req ─────┤                                         ╰──→ 200 - 4500ms
         │
         ╰─────────────────────────────────────────╳╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╮
                                                                     Timeout
                                                                        5s
```
In this example, all 4 middlewares - `A`, `B`, `C` & `D` - have
finished, resulting in a `200` response after ~`4500ms`. The timeout
is then cleared, signified by the `╳`.

## Usage

The middleware can be configured with a _custom_ timeout time and
status code.

```js
import Koa from 'koa'
import timeout from '@uswitch/koa-timeout'

const app = new Koa()

app.use(timeout(1000))                     // 1s timeout
app.use(timeout(1000, { status: 499 }))    // 1s timeout with 499 status
```

### Short circuiting

**N.B.** _By default_, `koa-timeout` does **not** short circuit the
other middlewares. This means that the in-flight request will _continue_ to be
processed even though a response has already been sent.

This behaviour can be useful in **development** to see where the slow
parts of the request are, however, in **production** you probably want
to kill the request as soon as possible.

##### **To enable short circuiting**

This will prevent the _next_ middleware after a timeout from
triggering.

```js
import { shortCircuit } from '@uswitch/koa-timeout'

app.use(timeout(5000))

app.get('*', shortCircuit(handleInitialState))
app.get('*', shortCircuit(handleRendering))
app.get('*', shortCircuit(handleReturn))

// Or

app.get('*', ...shortCircuit(handleInitialState, handleRendering, handleReturn))
```

<p align="center">
<i>
  <b>N.B.</b> when calling with <b>multiple</b> middlewares, make sure
  to <b>spread</b> the result!
  </br>
  i.e. <code>...shortCircuit(a, b, c)</code>
</i>
</p>
