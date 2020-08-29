'use strict';

var _resumeParser = require('resume-parser');

var _resumeParser2 = _interopRequireDefault(_resumeParser);

var _log4js = require('./../config/log4js');

var _log4js2 = _interopRequireDefault(_log4js);

var _appRootPath = require('app-root-path');

var _appRootPath2 = _interopRequireDefault(_appRootPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let cv_parser = {

    parseCV: function (cv_path) {
        _resumeParser2.default.parseResumeUrl('127.0.0.1:8080/' + cv_path).then(data => {
            _log4js2.default.log(data);
        }).catch(error => {
            _log4js2.default.error(error);
        });
    }
};

module.exports = cv_parser;