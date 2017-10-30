/* global describe, it, beforeEach, expect */
import tracer, { trace, traceError } from './koa-tracer'
import EventEmitter from 'events'

describe(`koa-tracer.js`, () => {
  describe(`when adding namespaced traces`, () => {
    beforeEach(() => { process.env.NODE_ENV = 'production' })

    it('should add a new trace context correctly', () => {
      const ctx = { state: {} }
      trace(ctx, 'new_trace', 'message')
      expect(ctx.state.trace.new_trace).toBeDefined()
    })

    it('should add multiple messages to the same context', () => {
      const ctx = { state: {} }
      trace(ctx, 'new_trace', 'message1')
      trace(ctx, 'new_trace', 'message2')

      expect(ctx.state.trace.new_trace.length).toBe(2)
      expect(ctx.state.trace.new_trace[0]).toEqual(expect.objectContaining({ msg: 'message1' }))
      expect(ctx.state.trace.new_trace[1]).toEqual(expect.objectContaining({ msg: 'message2' }))
    })

    it('should preserve other object properties passed in as meta data', () => {
      const ctx = { state: {} }
      trace(ctx, 'new_trace', { msg: 'message', reason: 'bar' })

      expect(ctx.state.trace.new_trace[0]).toEqual(expect.objectContaining({ msg: 'message', reason: 'bar' }))
    })

    it('should note down the time difference between traces', async () => {
      const ctx = { state: {} }

      trace(ctx, 'new_trace', 'a')
      await new Promise(resolve => setTimeout(resolve, 10))
      trace(ctx, 'new_trace', 'b')

      expect(ctx.state.trace.new_trace[1].timeDiff).toEqual(expect.any(Number))
    })

    it('should be able to trace multiple keys', () => {
      const ctx = { state: {} }

      trace(ctx, 'trace_one', 'a')
      trace(ctx, 'trace_two', 'b')

      expect(ctx.state.trace.trace_one).toBeDefined()
      expect(ctx.state.trace.trace_two).toBeDefined()
    })
  })

  describe(`when adding non-namespaced traces`, () => {
    it(`should add to a '__general' namespace`, () => {
      const ctx = { state: {} }
      trace(ctx, 'just a message')

      expect(ctx.state.trace.__general).toBeDefined()
    })

    it(`should not contain the 'timeDiff' property`, () => {
      const ctx = { state: {} }

      trace(ctx, 'just a message')
      trace(ctx, 'and again')

      expect(ctx.state.trace.__general[1].timeDiff).not.toBeDefined()
    })
  })

  describe(`when used as a 'koa' middleware`, () => {
    it('should set up the initial state of the middleware', (done) => {
      const t = tracer()
      const ctx = { state: {} }

      t(ctx, () => {
        expect(ctx.state.trace).toBeDefined()
        expect(ctx.state.traceStart).toBeDefined()

        done()
      })
    })

    it('should bind a tracing function to the context', (done) => {
      const t = tracer()
      const ctx = { state: {} }

      t(ctx, () => {
        expect(ctx.trace).toBeInstanceOf(Function)
        ctx.trace('message')
        expect(ctx.state.trace.__general[0]).toEqual(expect.objectContaining({ msg: 'message' }))
        done()
      })
    })

    it('should emit events whenever a trace happens', (done) => {
      const t = tracer()
      const ctx = { state: {}, app: new EventEmitter() }

      ctx.app.on('tracer:trace', ({ ctx, key, trace }) => {
        if (trace.msg === 'Goodbye') {
          expect(ctx.state.trace.foo.length).toEqual(2)
          done()
        }
      })

      t(ctx, () => {
        ctx.trace('foo', 'Hello')
        ctx.trace('foo', 'Goodbye')
      })
    })
  })

  describe(`when handling errors`, () => {
    it('should return the error string', () => {
      const ctx = { state: {} }
      traceError(ctx, 'New error!')

      expect(ctx.state.errors.length).toEqual(1)
      expect(ctx.state.errors[0].msg).toBe('New error!')
    })

    it(`should return the object passed through to the error`, () => {
      const ctx = { state: {} }
      traceError(ctx, { msg: 'nooooooo', reason: 'badddd' })

      expect(ctx.state.errors.length).toEqual(1)
      expect(ctx.state.errors[0]).toEqual(expect.objectContaining({ msg: 'nooooooo', reason: 'badddd' }))
    })

    it(`should retun the actual thrown exception`, (done) => {
      const ctx = { state: {} }

      try {
        throw new Error('Uh oh spaghetti-os')
      } catch (err) {
        traceError(ctx, err)

        expect(ctx.state.errors.length).toEqual(1)
        expect(ctx.state.errors[0]).toEqual(expect.objectContaining({ msg: 'Uh oh spaghetti-os', trace: expect.any(String) }))

        done()
      }
    })
  })
})
