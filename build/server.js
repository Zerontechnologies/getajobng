'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

var _log4js = require('./config/log4js');

var _log4js2 = _interopRequireDefault(_log4js);

var _cron_scheduler = require('./config/crons/cron_scheduler');

var _cron_scheduler2 = _interopRequireDefault(_cron_scheduler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const port = process.env.PORT || _config2.default.port;

//Create server with exported express app
const server = _http2.default.createServer(_app2.default);
server.listen(port);

_log4js2.default.log("Listening on Port: " + port);

//cronScheduler.scheduleAllJobs();