"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _database = require("../db/database");

var _database2 = _interopRequireDefault(_database);

var _user = require("../models/user");

var _user2 = _interopRequireDefault(_user);

var _log4js = require("./../config/log4js");

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.get("/:inviteToken", (req, res, next) => {
    let inviteToken = req.params.inviteToken;

    _database2.default.query(_user2.default.getUserByInviteToken(inviteToken), (err, data) => {
        if (!err) {
            if (data && data.length > 0) {
                _log4js2.default.log("User id Invited - " + data[0].user_id);
                let user_id = data[0].user_id;

                let user = new _user2.default();
                _database2.default.query(user.deactivateInviteToken(data[0].user_id), (err, data) => {
                    if (err) {
                        _log4js2.default.log(err);
                    } else {
                        _log4js2.default.log("User Invite Token is deactivated");

                        // Redirect to create password page
                        res.redirect('/recruiters/create-password?userId=' + user_id);
                    }
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