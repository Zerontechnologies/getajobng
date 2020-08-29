'use strict';

var _log4js = require('log4js');

var _log4js2 = _interopRequireDefault(_log4js);

var _appRootPath = require('app-root-path');

var _appRootPath2 = _interopRequireDefault(_appRootPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Logger Config
_log4js2.default.configure({
    appenders: {
        fileAppender: {
            type: 'file',
            filename: `${_appRootPath2.default}/logs/app_logs.log`,
            maxLogSize: 10485760,
            backups: 3,
            compress: true
        },
        console: {
            type: 'console'
        }
    },
    categories: {
        default: {
            appenders: ['fileAppender', 'console'],
            level: ['all']
        }
    }
});

let logger = {
    log: function (message) {
        let logger = _log4js2.default.getLogger();
        logger.level = 'trace';

        return logger.info(message);
    },

    error: function (message) {
        let logger = _log4js2.default.getLogger();
        logger.level = 'error';

        return logger.error(message);
    }
};

module.exports = logger;