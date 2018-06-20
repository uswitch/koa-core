'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRequestid = require('koa-requestid');

var _koaRequestid2 = _interopRequireDefault(_koaRequestid);

var _koaSignal = require('../dev/koa-signal');

var _koaSignal2 = _interopRequireDefault(_koaSignal);

var _koaAccess = require('@uswitch/koa-access');

var _koaAccess2 = _interopRequireDefault(_koaAccess);

var _koaTracer = require('@uswitch/koa-tracer');

var _koaTracer2 = _interopRequireDefault(_koaTracer);

var _serverRouter = require('./server-router');

var _serverRouter2 = _interopRequireDefault(_serverRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* @uswitch Koa libraries */
var app = new _koa2.default();

var signal = (0, _koaSignal2.default)({});

app.use((0, _koaRequestid2.default)());
app.use((0, _koaTracer2.default)());
app.use((0, _koaAccess2.default)(['id', 'trace']));

app.on(_koaTracer.eventTrace, function (_ref) {
  var key = _ref.key,
      trace = _ref.trace;
  return console.log(key, trace);
});
app.on(_koaAccess.eventAccess, signal.log);

app.use(_serverRouter2.default.routes());
app.listen(3000);