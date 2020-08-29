'use strict';

var _session_store = require('./../session_store');

var _session_store2 = _interopRequireDefault(_session_store);

var _config = require('./../config');

var _config2 = _interopRequireDefault(_config);

var _log4js = require('./../log4js');

var _log4js2 = _interopRequireDefault(_log4js);

var _mail_transport = require('./mail_transport');

var _mail_transport2 = _interopRequireDefault(_mail_transport);

var _sendgrid_transport = require('./sendgrid_transport');

var _sendgrid_transport2 = _interopRequireDefault(_sendgrid_transport);

var _helpers = require('./../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _database = require('./../../db/database');

var _database2 = _interopRequireDefault(_database);

var _user = require('./../../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let mailFunctions = {

    sendWelcomeMail: function (req, user_id, fullName, recipient_email) {
        let token = _helpers2.default.generateActivationToken();

        let user = new _user2.default();
        _database2.default.query(user.saveUserActivationToken(user_id, token), (err, data) => {
            if (!err) {
                _log4js2.default.log("User Token saved!");
            }
        });

        //let pre_link = 'https://' + req.get('host');
        let link = 'https://www.getajobng.com/auth/verify/' + user_id + '/' + token;
        //let fullLink = pre_link + link;

        let mailOptions = {
            from: _config2.default.from, // sender address
            to: recipient_email, // list of receivers
            subject: 'Welcome to GetaJobNG',
            text: 'Welcome',
            html: '<p>Hi <b>' + fullName + '</b>. Welcome to <b>GetaJobNG</b>.</p> \
            <p>Please click on the link below to activate your account:</p> \
            <p><a href="' + link + '">Activate Account</a></p> \
            <p>Best Regards,</p> \
            <p>Mr. Jobs</p>'

            //sendgridMailTransport.sendMail(mailOptions);
        };_mail_transport2.default.sendMail(mailOptions);
    },

    sendApplyToJobMail: function () {

        let mailOptions = {
            from: _config2.default.from, // sender address
            to: 'bereiwerisoc@yahoo.com, nathanielasogwa@yahoo.com, ibukunomisope2017@gmail.com, tobiloba.williams@c-ileasing.com', // list of receivers
            subject: 'We have a Job for you',
            text: 'Welcome',
            html: '<p>Hi! Good morning.</p> \
            <p>My name is Mr. Jobs and I have some awesome Slickline jobs for you.</p> \
            <p>Please click on the links below to apply.</p> \
            <ol> \
            <li><b>Slickline Operator:</b> <a href="https://getajobng.com/job-detail/3453" target="_blank">Click here to Apply</a></li> \
            <li><b>Slickline Chief Operator:</b> <a href="https://getajobng.com/job-detail/3453" target="_blank">Click here to Apply</a></li> \
            </ol>\
            <p>Please, don\'t forget to register, fill your profile and upload your CV/Resume.</p> \
            <p>You can also refer a friend.</p> \
            <p>Best Regards,</p> \
            <p>Mr. Jobs</p>'

            //sendgridMailTransport.sendMail(mailOptions);
        };_mail_transport2.default.sendMail(mailOptions);
    },

    sendJobApplicationMail: function (recipient_full_name, recipient_email, job_name) {
        let mailOptions = {
            from: _config2.default.from, // sender address
            to: recipient_email, // list of receivers
            subject: 'Thank you for your recent job application',
            text: 'Welcome',
            html: '<p>Dear ' + recipient_full_name + ',</p>\
                    <p>Thank you for your recent application to the following job vacancy:</p> \
                    <p><b>' + job_name + '</b></p> \
                    <p>Improve your chances of being hired. ' + 'Sign up for Job Alerts to receive the vacancies you are looking for straight to your inbox. ' + 'Keep your profile and CV updated so recruiters can find you when they have an opportunity for you! ' + 'Good luck with the search.</p> \
                    <p>Best Regards,</p> \
                    <p>Mr. Jobs</p>'
        };

        _mail_transport2.default.sendMail(mailOptions);
    },

    sendTeamInviteMail: function (req, recipient_email, sender_full_name, company_name, role_name) {
        //Generate Invite Token
        let token = _helpers2.default.generateInviteToken();

        //Save Invite token to user record
        let user = new _user2.default();
        _database2.default.query(user.saveInviteToken(recipient_email, token), (err, data) => {
            //Nothing done here
            if (!err) {
                _log4js2.default.log("User Token saved!");
            }
        });

        //let pre_link = 'https://' + req.get('host');
        let link = 'https://www.getajobng.com/invites/' + token;
        //let fullLink = pre_link + link;

        let mailOptions = {
            from: _config2.default.from, // sender address
            to: recipient_email, // list of receivers
            subject: 'Invitation to join your company team on GetaJobNG',
            text: 'Welcome',
            html: '<p>Hello,</p>\
                    <p>You have been invited by ' + sender_full_name + ' to join the ' + company_name + ' team \
                    as a ' + role_name + '.<br> \
                    Please click on the link below to accept:<br> \
                    <a href="' + link + '">Accept Invitation</a></p> \
                    <p>Best Regards,</p> \
                    <p>Mr. Jobs</p>'

            //sendgridMailTransport.sendMail(mailOptions);
        };_mail_transport2.default.sendMail(mailOptions);
    },

    sendJobPostedMail: function (req, recipient_email, recipient_full_name, job_id, job_title) {
        //let pre_link = 'https://' + req.get('host');
        let link = 'https://www.getajobng.com/job-detail/' + job_id;
        //let fullLink = pre_link + link;

        let mailOptions = {
            from: _config2.default.from, // sender address
            to: recipient_email, // list of receivers
            subject: 'Job Posted',
            text: 'Job Posted',
            html: '<p>Dear ' + recipient_full_name + ',</p>\
                    <p>Your job post titled <b>"' + job_title + '"</b> has been posted successfully.<br> \
                    Please click on the link below to view<br> \
                    <a href="' + link + '">View Job Post</a></p> \
                    <p>Best Regards,</p> \
                    <p>Mr. Jobs</p>'

            //sendgridMailTransport.sendMail(mailOptions);
        };_mail_transport2.default.sendMail(mailOptions);
    },

    sendCreateInterviewMail: function (req, recipient_full_name, recipient_email, interview_id, interview_name, interview_date, interview_time) {

        //let pre_link = 'https://' + req.get('host');
        let link = 'https://www.getajobng.com/interviews/interview-detail/' + interview_id;
        //let fullLink = pre_link + link;

        let mailOptions = {
            from: _config2.default.from, // sender address
            to: recipient_email, // list of receivers
            subject: 'Interview Created',
            text: 'Interview Created',
            html: '<p>Dear ' + recipient_full_name + ',</p>\
                    <p>You recently created an interview. Here are the details:</p> \
                    <br> \
                    <b>Name of Interview:</b> ' + interview_name + '<br> \
                    <b>Date:</b> ' + interview_date + '<br> \
                    <b>Time:</b> ' + interview_time + '<br> \
                    Please click on the link below to view more details <br> \
                    <a href="' + link + '">View Interview</a></p> \
                    <p>Best Regards,</p> \
                    <p>Mr. Jobs</p>'

            //sendgridMailTransport.sendMail(mailOptions);
        };_mail_transport2.default.sendMail(mailOptions);
    },

    sendForgotPasswordEmail: function (req, user_id, fullName, recipient_email) {
        let password_reset_token = _helpers2.default.generatePasswordResetToken();

        //Save Password reset token to user record
        let user = new _user2.default();
        _database2.default.query(user.savePasswordResetToken(user_id, password_reset_token), (err, data) => {
            //Nothing done here
            if (!err) {
                _log4js2.default.log("User Password Reset Token saved!");
            }
        });

        //let pre_link = 'https://' + req.get('host');
        let link = 'https://www.getajobng.com/auth/verify-password-token/' + password_reset_token;
        // let fullLink = pre_link + link;

        let mailOptions = {
            from: _config2.default.from, // sender address
            to: recipient_email, // list of receivers
            subject: 'Instructions for changing your GetaJobNG password',
            text: 'Welcome',
            html: '<p>Hello <b>' + fullName + ',</b></p> \
                <p>You recently requested to reset your password.</p> \
                <p>To reset your password, please follow the link below:</p> \
                <p><a href="' + link + '">Reset Password</a></p> \
                <p>If you are not sure why you are receiving this message, you can report it to us by emailing info@getajobng.com.</p>\
                <p>If you suspect someone may have unauthorised access to your account, we suggest you change your password as a precaution by visiting your Dashboard -> Settings -> Change Password.</p>\
                <p>Best Regards,</p> \
                <p>Mr. Jobs</p>'

            //sendgridMailTransport.sendMail(mailOptions);
        };_mail_transport2.default.sendMail(mailOptions);
    },

    sendWeeklyJobUpdatesMail: function (jobs, candidate) {
        let jobs_list_content = '';

        for (let i = 0; i < jobs.length; i++) {
            //let pre_link = req.protocol + '://' + req.get('host');
            let fullLink = 'https://www.getajobng.com/job-detail/' + jobs[i].job_id;
            //let fullLink = pre_link + link;

            jobs_list_content += '<tr> \
                                    <td> \
                                        <div class="site_row"> \
                                            <p style=""> \
                                                <a style="text-decoration:none;color:#06942A;font-weight:bold;font-size:14px" href="' + fullLink + '">' + jobs[i].job_name + '</a>\
                                            </p>\
                                            <p><i>' + jobs[i].company_name + ', ' + jobs[i].state_name + '</i></p>\
                                        </div>\
                                        <div class="candidates_for_open_job">\
                                            <a style="text-decoration:none;color:#06942A;font-weight:bold;font-size:12px" href="' + fullLink + '"> \
                                                View more \
                                            </a> \
                                        </div> \
                                        <hr>\
                                    </td>\
                                </tr>';
        }

        let mailOptions = {
            from: _config2.default.from, // sender address
            to: candidate.email,
            subject: 'We have jobs for you',
            text: 'Recommended Jobs',
            html: '<p>Dear ' + candidate.full_name + ',</p>\
                    <br> \
                    <p>We\'ve found some awesome jobs for you. Check them out!</p> \
                    <p><b>Job Listings:</b></p> \
                    <table id="jobs_table"> \
                        <thead> \
                            <tr> \
                                <th width="100%"></th> \
                            </tr> \
                        </thead> \
                        <tbody id="jobs_data">' + jobs_list_content + '</tbody>\
                    </table><br> \
                    <p><a style="text-decoration:none;color:#06942A;font-weight:bold;font-size:14px" \
                        href="www.getajobng.com/find-a-job" target="_blank">Click to view more Jobs</a></p> \
                    <p>Best Regards,</p> \
                    <p>Mr. Jobs</p>'

        };

        _log4js2.default.log('@@@@@ Sending WeeklyJob Updates Mail for candidate - ' + candidate.user_id + ' @@@@@');
        _mail_transport2.default.sendMail(mailOptions);
    }
};

module.exports = mailFunctions;