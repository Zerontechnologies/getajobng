'use strict';

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _log4js = require('./../config/log4js');

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pool = _mysql2.default.createPool({
    connectionLimit: 100,
    connectTimeout: 60 * 1000,
    acquireTimeout: 60 * 1000,
    timeout: 60 * 1000,
    host: _config2.default.local_db_host,
    user: _config2.default.local_db_username,
    password: _config2.default.local_db_password,
    database: _config2.default.local_database,
    debug: false
});

function executeQuery(sql, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null);
        } else {
            if (connection) {
                connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if (error) {
                        return callback(error, null);
                    }
                    return callback(null, results);
                });
            }
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