'use strict';

var _mail = require('@sendgrid/mail');

var _mail2 = _interopRequireDefault(_mail);

var _config = require('./../config');

var _config2 = _interopRequireDefault(_config);

var _log4js = require('./../log4js');

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.sendMail = function (mailOptions) {
    _mail2.default.setApiKey(_config2.default.sendgrid_password);

    _mail2.default.send(mailOptions, (error, info) => {
        if (error) {
            _log4js2.default.log("Mail not sent: -" + error);
        } else {
            _log4js2.default.log("Mail sent");
        }
    });
};