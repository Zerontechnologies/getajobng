"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _database = require("../db/database");

var _database2 = _interopRequireDefault(_database);

var _company = require("../models/company");

var _company2 = _interopRequireDefault(_company);

var _v = require("uuid/v4");

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.get("/", (req, res, next) => {

    _database2.default.query(_company2.default.getAllCompaniesQuery(), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "Companies listed.",
                companyId: data
            });
        }
    });
});

router.post("/add", (req, res, next) => {
    //read user information from request
    let company = new _company2.default((0, _v2.default)(), req.body.company_name, req.body.rc_number);

    _database2.default.query(company.createCompanyQuery(), (err, data) => {
        res.status(200).json({
            message: "Company added.",
            companyId: data.insertId
        });
    });
});

router.get("/:companyId", (req, res, next) => {
    let companyId = req.params.companyId;

    _database2.default.query(_company2.default.getCompanyByIdQuery(companyId), (err, data) => {
        if (!err) {
            if (data && data.length > 0) {
                res.status(200).json({
                    message: "Company found.",
                    product: data
                });
            } else {
                res.status(200).json({
                    message: "Company Not found."
                });
            }
        }
    });
});

router.post("/delete", (req, res, next) => {

    var companyId = req.body.companyId;

    _database2.default.query(_company2.default.deleteCompanyByIdQuery(companyId), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {
                res.status(200).json({
                    message: `Company deleted with id = ${companyId}.`,
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message: "Company Not found."
                });
            }
        }
    });
});

module.exports = router;