"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _database = require("../db/database");

var _database2 = _interopRequireDefault(_database);

var _user = require("../models/user");

var _user2 = _interopRequireDefault(_user);

var _v = require("uuid/v1");

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.get("/", (req, res, next) => {

    _database2.default.query(_user2.default.getAllUsersQuery(), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "Users listed.",
                users: data
            });
        }
    });
});

router.post("/add", (req, res, next) => {
    //read user information from request
    let user = new _user2.default((0, _v2.default)(), req.body.first_name, req.body.last_name, req.body.email, req.body.password);

    _database2.default.query(user.createUserQuery(), (err, data) => {
        res.status(200).json({
            message: "User added.",
            userId: data.insertId
        });
    });
});

router.get("/:userId", (req, res, next) => {
    let userId = req.params.userId;

    _database2.default.query(_user2.default.getUserByIdQuery(userId), (err, data) => {
        if (!err) {
            if (data && data.length > 0) {

                res.status(200).json({
                    message: "User found.",
                    user: data
                });
            } else {
                res.status(200).json({
                    message: "User Not found."
                });
            }
        }
    });
});

router.post("/delete", (req, res, next) => {

    var userId = req.body.userId;

    _database2.default.query(_user2.default.deleteUserByIdQuery(userId), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {
                res.status(200).json({
                    message: `User deleted with id = ${userId}.`,
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message: "User Not found."
                });
            }
        }
    });
});

module.exports = router;