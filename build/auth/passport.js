'use strict';

var _database = require('../db/database');

var _database2 = _interopRequireDefault(_database);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _company = require('../models/company');

var _company2 = _interopRequireDefault(_company);

var _resume = require('../models/resume');

var _resume2 = _interopRequireDefault(_resume);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportFacebook = require('passport-facebook');

var _passportFacebook2 = _interopRequireDefault(_passportFacebook);

var _passportGoogleOauth = require('passport-google-oauth20');

var _passportGoogleOauth2 = _interopRequireDefault(_passportGoogleOauth);

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _nodeDatetime = require('node-datetime');

var _nodeDatetime2 = _interopRequireDefault(_nodeDatetime);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _connectFlash = require('connect-flash');

var _connectFlash2 = _interopRequireDefault(_connectFlash);

var _session_store = require('./../config/session_store');

var _session_store2 = _interopRequireDefault(_session_store);

var _log4js = require('./../config/log4js');

var _log4js2 = _interopRequireDefault(_log4js);

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

var _mailer = require('../config/mail/mailer');

var _mailer2 = _interopRequireDefault(_mailer);

var _helpers = require('./../config/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const auth = _express2.default.Router();

auth.use((0, _cookieParser2.default)());
auth.use(_bodyParser2.default.urlencoded({ extended: false }));
auth.use(_passport2.default.initialize());
auth.use(_passport2.default.session());
auth.use((0, _connectFlash2.default)());

auth.use((0, _expressSession2.default)({
    secret: _config2.default.session_secret,
    resave: _config2.default.session_resave,
    key: _config2.default.session_key,
    saveUninitialized: _config2.default.session_save_uninitialized,
    cookie: { maxAge: _config2.default.session_cookie_max_age }
}));

// Passport Local Strategy 
_passport2.default.use(new _passportLocal2.default({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, username, password, done) {
    let returnUrl = req.body.returnUrl;
    let token = req.body.token;

    console.log('returnUrl(before) - ' + returnUrl);
    console.log('token(before) - ' + token);

    _database2.default.query(_user2.default.checkIfEmailExist(username), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
            return done(null, false, { message: 'Error' });
        }
        if (!data) {
            _log4js2.default.log("NO DATA");
            return done(null, false, { message: 'bad password' });
        }

        // if the user is found but the password is wrong
        if (data.length > 0) {
            if (!_bcryptjs2.default.compareSync(password, data[0].password)) {
                _log4js2.default.log("Password does not match");
                return done(null, false, { message: 'bad password2' });
            }
        }

        if (!data || data.length == 0) {
            _log4js2.default.log("This email is not registered");
            return done(null, false, { message: 'bad email/password' });
        } else {
            let getUserDataQuery = '';

            if (data[0].role_id == _config2.default.candidate_role_tag) {
                getUserDataQuery = _user2.default.getCandidateData(data[0].user_id);
            } else if (data[0].role_id == _config2.default.admin_role_tag) {
                getUserDataQuery = _user2.default.getAdminData(data[0].user_id);
            } else {
                getUserDataQuery = _user2.default.getRecruiterData(data[0].user_id);
            }

            _database2.default.query(getUserDataQuery, (err, data) => {
                if (err) {
                    _log4js2.default.log(err);
                } else {
                    //Check if there is a return url. If yes add it to userdata
                    if (typeof returnUrl != 'undefined' && returnUrl) {
                        data[0].returnUrl = returnUrl;
                        data[0].token = token;
                    }

                    // all is well, return successful user
                    return done(null, data[0]);
                }
            });
        }
    });
}));

auth.post('/login', _passport2.default.authenticate('local', {
    failureRedirect: '/login?f=l&r=f', // redirect back to the signup page if there is an error
    failureFlash: true,
    failureMessage: "Invalid Email/Password. Please try again."

}), function (req, res) {

    _log4js2.default.log("User exist and is redirecting");

    _log4js2.default.log(req.user);
    let userData = req.user;

    _database2.default.query(_user2.default.getUserRoleByUserId(userData.user_id), (err, data) => {
        if (!err) {
            if (data) {
                let user_role = data[0].role_id;
                _log4js2.default.log("user_role -" + user_role);

                if (user_role == _config2.default.candidate_role_tag) {
                    if (userData.returnUrl == 'start_test') {
                        processCandidateLoginToAssessment(req, res, userData, userData.token);
                    } else {
                        processCandidateLogin(req, res, userData, user_role);
                    }
                } else if (user_role == _config2.default.recruiter_admin_role_tag) {
                    processRecruiterAdminLogin(req, res, userData, user_role);
                } else if (user_role == _config2.default.recruiter_role_tag) {
                    processRecruiterLogin(req, res, userData, user_role);
                } else if (user_role == _config2.default.admin_role_tag) {
                    processAdminLogin(req, res, userData, user_role);
                } else {
                    _log4js2.default.log('No user role');
                    res.redirect('/login');
                }
            }
        }
    });
});

auth.get('/login', _passport2.default.authenticate('local', {
    failureRedirect: '/login?f=l&r=f', // redirect back to the signup page if there is an error
    failureFlash: true,
    failureMessage: "Invalid Email/Password. Please try again."

}), function (req, res) {

    _log4js2.default.log("User exist and is redirecting");

    _log4js2.default.log(req.user);
    let userData = req.user;

    //Save user id
    _session_store2.default.saveUserId(req, userData.user_id);

    _database2.default.query(_user2.default.getUserRoleByUserId(userData.user_id), (err, data) => {
        if (!err) {
            if (data) {
                let user_role = data[0].role_id;
                _log4js2.default.log("user_role -" + user_role);

                if (user_role == _config2.default.candidate_role_tag) {
                    processCandidateLogin(req, res, userData, user_role);
                } else if (user_role == _config2.default.recruiter_admin_role_tag) {
                    processRecruiterAdminLogin(req, res, userData, user_role);
                } else if (user_role == _config2.default.recruiter_role_tag) {
                    processRecruiterLogin(req, res, userData, user_role);
                } else {
                    _log4js2.default.log('No user role');
                    res.redirect('/login');
                }
            }
        }
    });
});

function processCandidateLogin(req, res, user, user_role) {
    _log4js2.default.log("User is a CANDIDATE. Getting all users info ");

    _database2.default.query(_resume2.default.getResumeIdByUserId(user.user_id), (err, data) => {
        if (!err) {
            if (data) {
                let resume_id = data[0].resume_id;

                //Save user info
                // storage.saveCandidateData(req, user.user_id, user.user_uuid, user.first_name,
                //    user.last_name, user.email, user.phone_number, user_role, true, user.is_activated,
                //    resume_id, user.is_first_login, user.gender, user.tagline, user.address, user.photo_url)
            }
        }
    });

    // Get all candidate resume
    let resume = new _resume2.default();
    resume.getAllUserResumeInformation(req, user.user_id);

    //Redirect to dashboard
    res.redirect('/candidates/dashboard');
}

function processRecruiterAdminLogin(req, res, user, user_role) {
    _log4js2.default.log("User is a RECRUITER ADMIN. Getting all info ");

    _database2.default.query(_company2.default.getUserCompany(user.user_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            if (data) {
                let company_id = data[0].company_id;
                let company_name = data[0].company_name;

                //Save recruiter info
                //storage.saveRecruiterData(req, user.user_id, user.user_uuid, user.first_name,
                //    user.last_name, user.email, user.phone_number, user_role, true, company_id, 
                //    company_name, user.is_activated, user.is_first_login, user.photo_url);

                // Redirect to dashboard
                res.redirect('/recruiters/dashboard');
            }
        }
    });
}

function processRecruiterLogin(req, res, user, user_role) {
    _log4js2.default.log("User is a RECRUITER. Getting all info ");

    _database2.default.query(_company2.default.getCompanyByIdQuery(user.company), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            if (data) {
                let company_id = data[0].company_id;
                let company_name = data[0].company_name;

                //Save recruiter info
                //storage.saveRecruiterData(req, user.user_id, user.user_uuid, user.first_name,
                //    user.last_name, user.email, user.phone_number, user_role, true, company_id, 
                //    company_name, user.is_activated, user.is_first_login, user.photo_url)

                // Redirect to dashboard
                res.redirect('/recruiters/dashboard');
            }
        }
    });
}

function processAdminLogin(req, res, user, user_role) {
    _log4js2.default.log("User is an ADMIN. Getting all info ");

    res.redirect('/admins/dashboard');
}

function processCandidateLoginToAssessment(req, res, user, token) {
    _log4js2.default.log("User is a CANDIDATE. Redirecting to Assessment");

    //Redirect to assessment
    res.redirect('/assessments/take-assessment/' + token);
}

// Passport Facebook Strategy 
_passport2.default.use(new _passportFacebook2.default({
    clientID: _config2.default.facebook_api_key,
    clientSecret: _config2.default.facebook_api_secret,
    callbackURL: _config2.default.facebook_callback_url,
    profileFields: ["id", "displayName", "email", "gender", "picture.type(large)"]
}, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        if (_config2.default.use_database === true) {

            _database2.default.query(_user2.default.checkIfUserExistsBySocialMediaId(profile.id), (err, data) => {
                if (err) {
                    throw err;
                }
                if (data && data.length === 0) {
                    let fullname = profile.displayName.split(' ');
                    let first_name,
                        last_name = '';

                    if (fullname.length > 0) {
                        first_name = fullname[1];
                        last_name = fullname[0];
                    } else {
                        first_name = fullname;
                    }

                    let dt = _nodeDatetime2.default.create();
                    let date_created = dt.format('Y-m-d H:M:S');

                    let user = new _user2.default((0, _v2.default)(), first_name, last_name, profile.emails[0].value, 'password', profile.id, date_created);
                    _database2.default.query(user.createCandidateQuery(), function (err, data) {
                        if (err) {
                            throw err;
                        } else {
                            if (data) {
                                let user_id = data.insertId;

                                _database2.default.query(_user2.default.insertUserRole(user_id, 1), (err, data) => {
                                    if (!err) {
                                        _log4js2.default.log("Candidate added with user role.");
                                        return done(null, profile);
                                    }
                                });
                            }
                        }
                    });
                    return done(null, profile);
                } else {
                    _log4js2.default.log("User already exist");
                    return done(null, profile);
                }
            });
        }
    });
}));

auth.get('/facebook', _passport2.default.authenticate('facebook', { scope: ['email', 'public_profile'] }));

auth.get('/facebook/callback', _passport2.default.authenticate('facebook', { failureRedirect: '/' }), function (req, res) {
    _log4js2.default.log('in facebook callback');
    res.render('dashboard');
});

// Passport Google Strategy 
_passport2.default.use(new _passportGoogleOauth2.default({
    clientID: _config2.default.google_client_id,
    clientSecret: _config2.default.google_client_secret,
    callbackURL: _config2.default.google_callback_url
}, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        if (_config2.default.use_database === true) {

            _database2.default.query(_user2.default.checkIfUserExistsBySocialMediaId(profile.id), (err, data) => {
                if (err) {
                    throw err;
                }
                if (data && data.length === 0) {
                    let fullname = profile.displayName.split(' ');
                    let first_name,
                        last_name = '';

                    if (fullname.length > 0) {
                        first_name = fullname[1];
                        last_name = fullname[0];
                    } else {
                        first_name = fullname;
                    }

                    let dt = _nodeDatetime2.default.create();
                    let date_created = dt.format('Y-m-d H:M:S');

                    let user = new _user2.default((0, _v2.default)(), first_name, last_name, profile.emails[0].value, 'password', profile.id, date_created);
                    _database2.default.query(user.createCandidateQuery(), function (err, data) {
                        if (err) {
                            throw err;
                        } else {
                            if (data) {
                                let user_id = data.insertId;

                                _database2.default.query(_user2.default.insertUserRole(user_id, _config2.default.candidate_role_tag), (err, data) => {
                                    if (!err) {
                                        _log4js2.default.log("Candidate added with user role.");
                                        return done(null, profile);
                                    }
                                });
                            }
                        }
                    });
                    return done(null, profile);
                } else {
                    _log4js2.default.log("User already exist");
                    return done(null, profile);
                }
            });
        }
    });
}));

auth.get('/google', _passport2.default.authenticate('google', { scope: ['email', 'profile', 'openid'] }));

auth.get('/google/callback', _passport2.default.authenticate('google', { failureRedirect: '/' }), function (req, res) {
    _log4js2.default.log('in google callback');
    res.render('dashboard');
});

// Passport LinkedIn Strategy 
// passport.use(new LinkedInStrategy({
//     clientID: config.linkedin_client_id,
//     clientSecret: config.linkedin_client_secret,
//     callbackURL: config.linkedin_callback_url,
//     scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social']
// }, 

// function(accessToken, refreshToken, profile, done) {
//     // asynchronous verification, for effect...
//     process.nextTick(function () {

//         logger.log(profile)
//       return done(null, profile);
//     });
// })); 

// auth.get('/linkedin', passport.authenticate('linkedin', {state: true}));

// auth.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/' }),
// function(req, res) {
//   logger.log('in linkedin callback');
//   res.render('dashboard');
// });


auth.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        _log4js2.default.log("user is already authenticated..proceed");
        return next();
    }

    _log4js2.default.log("user is not authenticated..back to login");
    res.redirect('/login');
};

auth.post('/forgotpassword', function (req, res) {
    let email = req.body.email;

    _database2.default.query(_user2.default.checkIfEmailExist(email), (err, data) => {
        if (err) {
            throw err;
        } else {
            if (data && data.length > 0) {
                _log4js2.default.log('user exist...Sending Password Reset Mail');

                let userData = data[0];

                let user_id = userData.user_id;
                let userFullName = userData.first_name + " " + userData.last_name;

                _mailer2.default.sendForgotPasswordEmail(req, user_id, userFullName, email);

                res.redirect('/forgot-password?v=s');
            } else {
                res.redirect('/forgot-password?v=f');
            }
        }
    });
});

auth.get("/verify-password-token/:token", (req, res, next) => {
    let password_reset_token = req.params.token;

    _database2.default.query(_user2.default.getUserByPasswordResetToken(password_reset_token), (err, data) => {
        if (!err) {
            if (data && data.length > 0) {
                _log4js2.default.log("User id From Password Reset Token - " + data[0].user_id);
                let user_id = data[0].user_id;

                let user = new _user2.default();
                _database2.default.query(user.deactivatePasswordResetToken(data[0].user_id), (err, data) => {
                    if (err) {
                        _log4js2.default.log(err);
                    } else {
                        _log4js2.default.log("User Password Reset Token is deactivated");

                        // Redirect to create password page
                        res.redirect('/create-password?userId=' + user_id);
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

auth.get('/verify/:userId/:token', function (req, res) {
    let user_id = req.params.userId;
    let token = req.params.token;

    let user = new _user2.default();

    _database2.default.query(user.compareUserActivationToken(user_id, token), (err, data) => {
        if (!err) {
            if (data && data.length > 0) {
                _database2.default.query(user.activateUser(user_id), (err, data) => {
                    if (!err) {
                        if (data && data.affectedRows > 0) {
                            _log4js2.default.log("User activated");

                            let ifAuthenticated = _helpers2.default.checkifAuthenticated(req, res);
                            _log4js2.default.log('ifAuthenticated - ' + ifAuthenticated);

                            if (ifAuthenticated) {
                                res.redirect("/candidates/dashboard");
                            }
                        } else {
                            _log4js2.default.log("User NOT activated");
                            res.send("User NOT activated");
                        }
                    }
                });
            } else {
                _log4js2.default.log("User with token doesnt exist");
                res.send("User with token doesnt exist");
            }
        }
    });
});

// Passport session setup.
_passport2.default.serializeUser(function (user, done) {
    _log4js2.default.log("This is user id serializwd -----" + user.user_id);

    done(null, user);
});

_passport2.default.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = auth, ensureAuthenticated;