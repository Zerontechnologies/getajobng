"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _database = require("../db/database");

var _database2 = _interopRequireDefault(_database);

var _payment = require("../models/payment");

var _payment2 = _interopRequireDefault(_payment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.post("/save-transaction-info", (req, res, next) => {
    let transaction_code = req.body.trxref;
    let amount = req.body.amount;
    let status = req.body.status;
    let user_id = req.body.user_id;
    let payment_plan_id = req.body.payment_plan_id;

    let payment = new _payment2.default();
    _database2.default.query(payment.getCompanyIdByUserId(user_id), (err, data) => {
        if (!err) {
            let company_id = data[0].company_id;

            _database2.default.query(payment.savePaymentTransaction(transaction_code, company_id, user_id, payment_plan_id, amount, status), (err, data) => {
                if (!err) {
                    res.status(200).json({
                        message: "Payment Transaction Saved.",
                        transaction_id: data.insertId
                    });
                }
            });
        }
    });
});

module.exports = router;