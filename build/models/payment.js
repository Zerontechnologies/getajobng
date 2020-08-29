'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodeDatetime = require('node-datetime');

var _nodeDatetime2 = _interopRequireDefault(_nodeDatetime);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _database = require('../db/database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Payment {

    savePaymentTransaction(transaction_code, company_id, user_id, payment_plan_id, amount, status) {
        transaction_code = this.checkifUndefined(transaction_code);
        company_id = this.checkifUndefined(company_id);
        user_id = this.checkifUndefined(user_id);
        payment_plan_id = this.checkifUndefined(payment_plan_id);
        amount = this.checkifUndefined(amount);
        status = this.checkifUndefined(status);

        let date_created = this.getCurrentTimeStamp();

        let sql = `INSERT INTO transactions(transaction_code, company_id, user_id, payment_plan_id, amount, status, \
            date_created) VALUES ('${transaction_code}', ${company_id}, ${user_id}, ${payment_plan_id}, '${amount}', \
            '${status}', '${date_created}')`;

        return sql;
    }

    getCompanyIdByUserId(user_id) {
        let sql = `SELECT company_id FROM company WHERE created_by = ${user_id}`;

        return sql;
    }

    checkifUndefined(value) {
        if (typeof value === 'undefined') {
            return null;
        } else {
            return value;
        }
    }

    getCurrentTimeStamp() {
        let dt = _nodeDatetime2.default.create();
        let date_created = dt.format('Y-m-d H:M:S');

        return date_created;
    }

}

exports.default = Payment;