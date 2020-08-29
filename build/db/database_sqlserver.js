'use strict';

var _mssql = require('mssql');

var _mssql2 = _interopRequireDefault(_mssql);

var _log4js = require('./../config/log4js');

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// config for your database
var config = {
    user: 'sa',
    password: 'Password@2019',
    server: 'CILAG540GETAJOBNG',
    database: 'getajobng'
};

function executeQuery(sql, callback) {
    _mssql2.default.connect(config, function (err) {
        if (err) {
            _log4js2.default.log("Error while connecting database :- " + err);
            callback(err, null);
        } else {
            // create Request object
            var request = new _mssql2.default.Request();
            // query to the database
            request.query(sql, function (err, results) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, results);
                }
            });
        }
    });
}

function query(sql, callback) {
    executeQuery(sql, function (err, data) {
        _log4js2.default.log("SQL: " + sql);

        if (err) {
            _log4js2.default.log("ERROR: " + err);
            return callback(err);
        }

        callback(null, data);
    });
}

module.exports = {
    query: query
};