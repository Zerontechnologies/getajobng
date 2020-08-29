import nodeMailer from 'nodemailer';
import logger from '../log4js';

exports.sendMail = function(mailOptions){
  logger.log('in mailer ' + mailOptions)
  let transporter = nodeMailer.createTransport({
    host: 'smtp.office365.com',
    //port: 465,
    port: 587,
    secure: false,  //true for 465 port, false for other ports
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
      logger.log('mail not sent - ' + error);
    } else {
      logger.log('mail sent');
    }
  });
}