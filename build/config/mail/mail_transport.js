'use strict';

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _log4js = require('../log4js');

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.sendMail = function (mailOptions) {
  _log4js2.default.log('in mailer ' + mailOptions);
  let transporter = _nodemailer2.default.createTransport({
    host: 'smtp.office365.com',
    //port: 465,
    port: 587,
    secure: false, //true for 465 port, false for other ports
    auth: {
      user: 'info@getajobng.com',
      pass: 'Password@2019'
    }
  });

  /*let mailOptions = {
    from: '"Jobs from GetaJobNG" <info@getajobng.com>', // sender address
    to: 'tobiwily@yahoo.com, tobiloba.williams@c-ileasing.com', // list of receivers
    subject: 'Welcome to GetaJobNG ', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
  }; */

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      _log4js2.default.log('mail not sent - ' + error);
    } else {
      _log4js2.default.log('mail sent');
    }
  });
};