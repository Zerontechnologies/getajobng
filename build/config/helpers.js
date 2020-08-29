'use strict';

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _database = require('./../db/database');

var _database2 = _interopRequireDefault(_database);

var _nodeDatetime = require('node-datetime');

var _nodeDatetime2 = _interopRequireDefault(_nodeDatetime);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _log4js = require('./log4js');

var _log4js2 = _interopRequireDefault(_log4js);

var _session_store = require('../config/session_store');

var _session_store2 = _interopRequireDefault(_session_store);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _appRootPath = require('app-root-path');

var _appRootPath2 = _interopRequireDefault(_appRootPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let helpers = {
    generateActivationToken: function () {
        return _crypto2.default.randomBytes(64).toString('hex');
    },

    generateInviteToken: function () {
        return _crypto2.default.randomBytes(10).toString('hex');
    },

    generatePasswordResetToken: function () {
        return _crypto2.default.randomBytes(10).toString('hex');
    },

    generateToken10: function () {
        return _crypto2.default.randomBytes(10).toString('hex');
    },

    stringifyArray: function (array) {
        return JSON.stringify(array);
    },

    parseJSONToArray: function (json) {
        return JSON.parse(json);
    },

    getUsersActivityTrail: function (user_id) {
        let sql = `SELECT * FROM activity_trail WHERE user_id = ${user_id}`;

        _database2.default.query(sql, (err, data) => {
            if (err) {
                _log4js2.default.log(err);
            } else {
                _log4js2.default.log(data);
            }
        });
    },

    saveActivityTrail: function (user_id, title, description) {
        let date_created = this.getCurrentTimeStamp();

        let sql = `INSERT INTO activity_trail(title, description, user_id, date_created) VALUES \
                    ('${title}', '${description}', ${user_id}, '${date_created}')`;

        _database2.default.query(sql, (err, data) => {
            if (err) {
                _log4js2.default.log(err);
            } else {
                _log4js2.default.log("Activity_trail saved.");
            }
        });
    },

    checkifUndefined: function (value) {
        if (typeof value === 'undefined') {
            return null;
        } else {
            return value;
        }
    },

    getCurrentTimeStamp: function () {
        let dt = _nodeDatetime2.default.create();
        let date_created = dt.format('Y-m-d H:M:S');

        return date_created;
    },

    convertDateTimeToMilliseconds: function (dateTime) {
        let date = new Date(dateTime);

        return date.getTime();
    },

    showNotifyAlert: function () {},

    getCurrentTimeAgo: function (dateTime) {
        return (0, _moment2.default)(dateTime).fromNow();
    },

    formatDateTime: function (dateTime) {
        return (0, _moment2.default)(dateTime).format('ll');
    },

    formatDateToDatetime: function (date) {
        return (0, _moment2.default)(date).format('YYYY-MM-DD HH:mm:ss');
    },

    checkIfDirectoryExist: function (dir) {
        if (!_fs2.default.existsSync(dir)) {
            _fs2.default.mkdirSync(dir);
        }
    },

    calculateProfilePercentage: function (user_id, userData, resumeInfo, resumeEducation, resumeWorkExperience, resumeCertification, resumeSkill) {

        let profile_score = 0;
        let user = new _user2.default();

        _database2.default.query(user.getAllSettingForProfilePercentage(), (err, data) => {
            if (err) {
                _log4js2.default.log(err);
            } else {
                let allParams = {};
                let total_param_score = 0;

                //Organize data
                for (let i = 0; i < data.length; i++) {
                    allParams[data[i].setting_name] = parseInt(data[i].value);
                    total_param_score += parseInt(data[i].value);
                }

                //Checks
                if (typeof userData && resumeInfo && resumeEducation && resumeWorkExperience && resumeCertification == 'undefined') {

                    profile_score = 0;
                } else {
                    if (typeof userData.first_name != 'undefined' && userData.first_name && userData.first_name != '') {
                        profile_score += allParams.pp_first_name;
                    }

                    if (typeof userData.last_name != 'undefined' && userData.last_name && userData.last_name != '') {
                        profile_score += allParams.pp_last_name;
                    }

                    if (typeof userData.email != 'undefined' && userData.email && userData.email != '') {
                        profile_score += allParams.pp_email;
                    }

                    if (typeof userData.phone_number != 'undefined' && userData.phone_number && userData.phone_number != '') {
                        profile_score += allParams.pp_phone_number;
                    }

                    if (typeof userData.profile_picture != 'undefined' && userData.profile_picture && userData.profile_picture != '') {
                        profile_score += allParams.pp_profile_picture;
                    }

                    if (typeof resumeInfo.resume_file_url != 'undefined' && resumeInfo.resume_file_url && resumeInfo.resume_file_url != '') {
                        profile_score += allParams.pp_cv_upload;
                    }

                    if (typeof resumeInfo.profile_summary != 'undefined' && resumeInfo.profile_summary && resumeInfo.profile_summary != '') {
                        profile_score += allParams.pp_summary;
                    }

                    if (typeof resumeEducation != 'undefined' && resumeEducation && resumeEducation.length > 0) {
                        profile_score += allParams.pp_education;
                    }

                    if (typeof resumeWorkExperience != 'undefined' && resumeWorkExperience && resumeWorkExperience.length > 0) {
                        profile_score += allParams.pp_work_experience;
                    }

                    if (typeof resumeCertification != 'undefined' && resumeCertification && resumeCertification.length > 0) {
                        profile_score += allParams.pp_certificates;
                    }

                    if (typeof resumeSkill != 'undefined' && resumeSkill && resumeSkill.length > 0) {
                        profile_score += allParams.pp_skills;
                    }

                    if (typeof userData.address != 'undefined' && userData.address && userData.address != '') {
                        profile_score += allParams.pp_address;
                    }

                    if (typeof userData.state != 'undefined' && userData.state && userData.state != '') {
                        profile_score += allParams.pp_state;
                    }

                    if (typeof userData.country != 'undefined' && userData.country && userData.country != '') {
                        profile_score += allParams.pp_country;
                    }

                    if (typeof userData.gender != 'undefined' && userData.gender && userData.gender != '') {
                        profile_score += allParams.pp_gender;
                    }

                    if (typeof userData.tagline != 'undefined' && userData.tagline && userData.tagline != '') {
                        profile_score += allParams.pp_tagline;
                    }
                }

                _log4js2.default.log('profile_score - ' + profile_score);
                _log4js2.default.log('total_param_score - ' + total_param_score);

                let profile_percentage = Math.round(profile_score / total_param_score * 100);
                _log4js2.default.log('profile_percentage - ' + profile_percentage);

                _database2.default.query(user.saveProfilePercentage(user_id, profile_percentage), (err, data) => {
                    if (err) {
                        _log4js2.default.log(err);
                    } else {
                        _log4js2.default.log('profile_percentage saved');
                    }
                });
            }
        });
    },

    sortRecommendedJobsArray: function (unsortedArray) {
        let sortedArray = unsortedArray.concat();

        for (let i = 0; i < sortedArray.length; ++i) {
            for (let j = i + 1; j < sortedArray.length; ++j) {
                if (sortedArray[i].job_id === sortedArray[j].job_id) {
                    sortedArray.splice(j--, 1);
                }
            }
        }

        return sortedArray;
    },

    sortUsersArray: function (unsortedArray) {
        let sortedArray = unsortedArray.concat();

        for (let i = 0; i < sortedArray.length; ++i) {
            for (let j = i + 1; j < sortedArray.length; ++j) {
                if (sortedArray[i].user_id === sortedArray[j].user_id) {
                    sortedArray.splice(j--, 1);
                }
            }
        }

        return sortedArray;
    },

    runPostRequestToLogin: function (hostlink, path, email, password) {
        _log4js2.default.log('hostlink - ' + hostlink);

        let params = {
            username: email,
            password: password
        };

        let post_data = _querystring2.default.stringify(params);

        let options = {
            url: hostlink,
            path: path,
            port: _config2.default.port,
            method: 'POST'
        };

        let request = _http2.default.request(options, response => {});

        request.write(post_data);
        request.end();
    },

    checkifAuthenticated: function (req, res) {
        if (typeof req.session.passport == 'undefined') {
            _log4js2.default.log("user is not authenticated..back to login");

            let go_to_login_file = `${_appRootPath2.default}/views/go_to_login.html`;

            res.sendFile(go_to_login_file);
            //res.redirect('/login?');

            return false;
        } else {
            _log4js2.default.log("user is already authenticated..proceed");

            return true;
        }
    },

    unescapeHTML: function (escapedHTML) {
        return escapedHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, "&").replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&rsquo;/g, "'").replace(/(?:\r\n|\r|\n)/g, '');
    },

    escapeString: function (val) {
        val = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function (s) {
            switch (s) {
                case "\0":
                    return "\\0";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\b":
                    return "\\b";
                case "\t":
                    return "\\t";
                case "\x1a":
                    return "\\Z";
                case "'":
                    return "''";
                case '"':
                    return '""';
                default:
                    return "\\" + s;
            }
        });

        return val;
    },

    downloadFile: function (res, fileName) {
        _log4js2.default.log("Downloading File");
        //let file = path.join(__dirname, '../assets' , fileName);
        let file = `${_appRootPath2.default}/assets/uploads/docs/resumes/${fileName}`;

        res.download(file);
    },

    copyFile: function (file, dir2) {
        //gets file name and adds it to dir2
        let f = _path2.default.basename(file);
        let source = _fs2.default.createReadStream(file);
        let dest = _fs2.default.createWriteStream(_path2.default.resolve(dir2, f));

        source.pipe(dest);
        source.on('end', function () {
            _log4js2.default.log('Succesfully copied');
        });
        source.on('error', function (err) {
            _log4js2.default.log(err);
        });
    },

    checkApplicationDeadline: function (date) {
        var current_date = (0, _moment2.default)();
        var converted_date = (0, _moment2.default)(date);

        return converted_date < current_date ? 'Closed' : this.formatDateTime(date);
    }
};

module.exports = helpers;