'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _connectFlash = require('connect-flash');

var _connectFlash2 = _interopRequireDefault(_connectFlash);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _appRootPath = require('app-root-path');

var _appRootPath2 = _interopRequireDefault(_appRootPath);

var _users = require('./api/users');

var _users2 = _interopRequireDefault(_users);

var _jobs = require('./api/jobs');

var _jobs2 = _interopRequireDefault(_jobs);

var _companies = require('./api/companies');

var _companies2 = _interopRequireDefault(_companies);

var _candidates = require('./api/candidates');

var _candidates2 = _interopRequireDefault(_candidates);

var _recruiters = require('./api/recruiters');

var _recruiters2 = _interopRequireDefault(_recruiters);

var _passport3 = require('./auth/passport');

var _passport4 = _interopRequireDefault(_passport3);

var _resumes = require('./api/resumes');

var _resumes2 = _interopRequireDefault(_resumes);

var _payments = require('./api/payments');

var _payments2 = _interopRequireDefault(_payments);

var _invites = require('./api/invites');

var _invites2 = _interopRequireDefault(_invites);

var _assessments = require('./api/assessments');

var _assessments2 = _interopRequireDefault(_assessments);

var _admins = require('./api/admins');

var _admins2 = _interopRequireDefault(_admins);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

var _user = require('./models/user');

var _user2 = _interopRequireDefault(_user);

var _job = require('./models/job');

var _job2 = _interopRequireDefault(_job);

var _database = require('./db/database');

var _database2 = _interopRequireDefault(_database);

var _helpers = require('./config/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _log4js = require('./config/log4js');

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();

app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

app.use((0, _cookieParser2.default)());
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());
app.use((0, _connectFlash2.default)());

app.use((0, _expressSession2.default)({
    secret: _config2.default.session_secret,
    resave: _config2.default.session_resave,
    key: _config2.default.session_key,
    saveUninitialized: _config2.default.session_save_uninitialized,
    cookie: { maxAge: _config2.default.session_cookie_max_age }
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(_express2.default.static(__dirname + '/assets'));

app.use("/users", _users2.default);
app.use("/jobs", _jobs2.default);
app.use("/companies", _companies2.default);
app.use("/auth", _passport4.default);
app.use("/candidates", _candidates2.default);
app.use("/recruiters", _recruiters2.default);
app.use("/resume", _resumes2.default);
app.use("/payments", _payments2.default);
app.use("/invites", _invites2.default);
app.use("/assessments", _assessments2.default);
app.use("/admins", _admins2.default);

app.get('/faq', function (req, res) {
    if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
        let userData = req.session.passport.user;
        res.render('faq', {
            userAuthenticated: 'true',
            userData: userData
        });
    } else {
        res.render('faq', {
            userAuthenticated: 'false'
        });
    }
});

app.get('/', function (req, res) {

    let job = new _job2.default();
    _database2.default.query(job.get10LatestJobs(), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            let jobs = data;

            if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
                let userData = req.session.passport.user;
                res.render('index', {
                    userAuthenticated: 'true',
                    userData: userData,
                    jobs: jobs
                });
            } else {
                res.render('index', {
                    userAuthenticated: 'false',
                    jobs: jobs
                });
            }
        }
    });
});

app.get('/company-info', function (req, res) {
    if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
        let userData = req.session.passport.user;
        res.render('company_info', {
            userAuthenticated: 'true',
            userData: userData
        });
    } else {
        res.render('company_info', {
            userAuthenticated: 'false'
        });
    }
});

app.get('/find-a-job', function (req, res) {
    if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
        let userData = req.session.passport.user;
        res.render('search_job', {
            userAuthenticated: 'true',
            userData: userData
        });
    } else {
        res.render('search_job', {
            userAuthenticated: 'false'
        });
    }
});

app.get('/job-detail/:jobId', function (req, res) {
    let jobId = req.params.jobId;

    _database2.default.query(_job2.default.getJobByIdQuery(jobId), (err, data) => {
        if (!err) {
            let jobData = data[0];

            if (typeof jobData.company_description != 'undefined' && jobData.company_description != null && jobData.company_description != 'null' && jobData.company_description != '') {

                jobData.company_description = jobData.company_description.substring(0, jobData.company_description.length - 1);
                jobData.company_description = _helpers2.default.unescapeHTML(jobData.company_description);
            }

            if (typeof jobData.job_description != 'undefined' && jobData.job_description != null && jobData.job_description != 'null' && jobData.job_description != '') {

                jobData.job_description = jobData.job_description.substring(0, jobData.job_description.length - 1);
                jobData.job_description = _helpers2.default.unescapeHTML(jobData.job_description);
            }

            if (typeof jobData.job_responsibilities != 'undefined' && jobData.job_responsibilities != null && jobData.job_responsibilities != 'null' && jobData.job_responsibilities != '') {

                jobData.job_responsibilities = jobData.job_responsibilities.substring(0, jobData.job_responsibilities.length - 1);
                jobData.job_responsibilities = _helpers2.default.unescapeHTML(jobData.job_responsibilities);
            }

            jobData.application_deadline = _helpers2.default.checkApplicationDeadline(jobData.application_deadline);
            console.log(jobData);

            if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
                let userData = req.session.passport.user;
                res.render('job_detail', {
                    userAuthenticated: 'true',
                    jobData: jobData,
                    userData: userData
                });
            } else {
                res.render('job_detail', {
                    userAuthenticated: 'false',
                    jobData: jobData
                });
            }
        } else {
            _log4js2.default.log('Error getting job');
            _log4js2.default.log(err);
        }
    });
});

app.get('/login', function (req, res) {
    let redirectFrom = req.query.f;
    let response = req.query.r;

    if (typeof redirectFrom != 'undefined' && redirectFrom) {
        //If redirect is from Update User Profile
        if (redirectFrom == 'u_iu') {
            res.render('login', {
                showAlert: true,
                alertMessage: response == 's' ? 'Information Saved Successfully. Please login' : 'Profile could not update',
                alertType: response == 's' ? 'success' : 'error'
            });
        } else if (redirectFrom == 'l') {
            res.render('login', {
                showAlert: true,
                alertMessage: response == 's' ? 'Login Successful' : 'Invalid E-mail or Password',
                alertType: response == 's' ? 'success' : 'error'
            });
        } else if (redirectFrom == 'fp') {
            res.render('login', {
                showAlert: true,
                alertMessage: response == 's' ? 'Password has been changed successfully' : 'Something happened while changing your password. Please contact support.',
                alertType: response == 's' ? 'success' : 'error'
            });
        } else if (redirectFrom == 'start_test') {
            res.render('login', {
                showAlert: true,
                alertMessage: 'You need to login to take this test',
                alertType: 'info',
                returnUrl: 'start_test'
            });
        }
    } else {
        res.render('login');
    }
});

app.get('/candidate-info', function (req, res) {
    if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
        let userData = req.session.passport.user;
        res.render('candidates_landing_page', {
            userAuthenticated: 'true',
            userData: userData
        });
    } else {
        res.render('candidates_landing_page', {
            userAuthenticated: 'false'
        });
    }
});

app.get('/recruiter-info', function (req, res) {
    if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
        let userData = req.session.passport.user;
        res.render('recruiters_landing_page', {
            userAuthenticated: 'true',
            userData: userData
        });
    } else {
        res.render('recruiters_landing_page', {
            userAuthenticated: 'false'
        });
    }
});

app.get('/assessment', function (req, res) {
    if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
        let userData = req.session.passport.user;
        res.render('assessment_landing_page', {
            userAuthenticated: 'true',
            userData: userData
        });
    } else {
        res.render('assessment_landing_page', {
            userAuthenticated: 'false'
        });
    }
});

app.get('/career-advice', function (req, res) {
    res.redirect('http://blog.getajobng.com');
});

app.get('/post-a-job', function (req, res) {
    res.render('login');
});

app.get('/register', function (req, res) {
    let response = req.query.v;

    if (typeof response != 'undefined' && response) {
        res.render('register', {
            showAlert: true,
            alertMessage: response == 's' ? 'Registration Successful' : 'This email address exists in our database. Please use another email.',
            alertType: response == 's' ? 'success' : 'error'
        });
    } else {
        res.render('register');
    }
});

app.get('/forgot-password', function (req, res) {
    let response = req.query.v;

    if (typeof response != 'undefined' && response) {
        res.render('forgot_password', {
            showAlert: true,
            alertMessage: response == 's' ? 'A Password Reset link has been sent to your registered email address' : 'This email address does not exist in our database.',
            alertType: response == 's' ? 'success' : 'error'
        });
    } else {
        res.render('forgot_password');
    }
});

app.get("/create-password", (req, res, next) => {

    let user_id = req.query.userId;

    res.render('change_password', { user_id: user_id });
});

app.post("/create-password-for-user", (req, res, next) => {
    let user_id = req.body.user_id;
    let password = req.body.password;

    _database2.default.query(_user2.default.updatePasswordForUser(user_id, password), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {

                _helpers2.default.saveActivityTrail(user_id, "Password Reset", "Password has been changed successfully.");

                res.redirect('/login?f=fp&r=s');
            } else {
                res.redirect('/recruiters/create-password?userId=' + user_id);
            }
        }
    });
});

app.get('/privacy-policy', function (req, res) {
    if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
        let userData = req.session.passport.user;
        res.render('privacy_policy', {
            userAuthenticated: 'true',
            userData: userData
        });
    } else {
        res.render('privacy_policy', {
            userAuthenticated: 'false'
        });
    }
});

app.get('/cookie-policy', function (req, res) {
    if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
        let userData = req.session.passport.user;
        res.render('cookie_policy', {
            userAuthenticated: 'true',
            userData: userData
        });
    } else {
        res.render('cookie_policy', {
            userAuthenticated: 'false'
        });
    }
});

app.get('/h1dd3n_s1t3map', function (req, res) {
    let sitemap_file = `${_appRootPath2.default}/views/includes/sitemap/sitemap.xml`;

    res.sendFile(sitemap_file);
});

//if we are here then the specified request is not found
app.use((req, res, next) => {
    if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
        let userData = req.session.passport.user;
        res.status(404).render('404', {
            userAuthenticated: 'true',
            userData: userData
        });
    } else {
        res.status(404).render('404', {
            userAuthenticated: 'false'
        });
    }
});

//all other requests are not implemented.
app.use((err, req, res, next) => {
    res.status(err.status || 501);
    res.json({
        error: {
            code: err.status || 501,
            message: err.message
        }
    });
});

module.exports = app;