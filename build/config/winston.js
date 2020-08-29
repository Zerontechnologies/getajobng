'use strict';

var _appRootPath = require('app-root-path');

var _appRootPath2 = _interopRequireDefault(_appRootPath);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let options = {
    file: {
        level: 'info',
        filename: `${_appRootPath2.default}/logs/app_logs.log`,
        handleExceptions: true,
        json: true,
        maxsize: 10485760, //10MB
        maxFiles: 5,
        colorize: false
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
    }
};

let logger = new _winston2.default.Logger({
    transports: [new _winston2.default.transports.File(options.file), new _winston2.default.transports.Console(options.console)],
    exitOnError: false
});

logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};

module.exports = logger;