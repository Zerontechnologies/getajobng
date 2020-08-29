"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _database = require("../db/database");

var _database2 = _interopRequireDefault(_database);

var _user = require("../models/user");

var _user2 = _interopRequireDefault(_user);

var _v = require("uuid/v1");

var _v2 = _interopRequireDefault(_v);

var _config = require("../config/config");

var _config2 = _interopRequireDefault(_config);

var _mailer = require("../config/mail/mailer");

var _mailer2 = _interopRequireDefault(_mailer);

var _helpers = require("../config/helpers");

var _helpers2 = _interopRequireDefault(_helpers);

var _log4js = require("../config/log4js");

var _log4js2 = _interopRequireDefault(_log4js);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _formidable = require("formidable");

var _formidable2 = _interopRequireDefault(_formidable);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _resume = require("../models/resume");

var _resume2 = _interopRequireDefault(_resume);

var _job = require("../models/job");

var _job2 = _interopRequireDefault(_job);

var _azure_helpers = require("../config/azure_helpers");

var _azure_helpers2 = _interopRequireDefault(_azure_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.use((0, _cookieParser2.default)());
router.use(_bodyParser2.default.urlencoded({ extended: false }));

router.use((0, _expressSession2.default)({
    secret: _config2.default.session_secret,
    resave: _config2.default.session_resave,
    key: _config2.default.session_key,
    saveUninitialized: _config2.default.session_save_uninitialized,
    cookie: { maxAge: _config2.default.session_cookie_max_age }
}));

router.get('/dashboard', function (req, res) {
    let userData = req.session.passport.user;

    res.render('candidate_dashboard', {
        view: 'dashboard',
        data: userData
    });
});

router.get('/profile', function (req, res) {
    let userData = req.session.passport.user;
    _log4js2.default.log(userData);

    let redirectFrom = req.query.q;
    let response = req.query.r;

    if (typeof redirectFrom != 'undefined' && redirectFrom) {
        if (redirectFrom == 'summary') {
            res.render('candidate_profile', {
                view: 'profile',
                data: userData,
                showAlert: true,
                alertMessage: response == 's' ? 'Summary Successfully Updated' : 'An error occurred',
                alertType: response == 's' ? 'success' : 'error'
            });
        } else if (redirectFrom == 'we_a') {
            res.render('candidate_profile', {
                view: 'profile',
                data: userData,
                showAlert: true,
                alertMessage: response == 's' ? 'Experience Saved' : 'Experience not added',
                alertType: response == 's' ? 'success' : 'error'
            });
        } else if (redirectFrom == 'we_e') {
            res.render('candidate_profile', {
                view: 'profile',
                data: userData,
                showAlert: true,
                alertMessage: response == 's' ? 'Experience Saved Successfully' : 'Experience edit failed',
                alertType: response == 's' ? 'success' : 'error'
            });
        } else if (redirectFrom == 'we_d') {
            res.render('candidate_profile', {
                view: 'profile',
                data: userData,
                showAlert: true,
                alertMessage: response == 's' ? 'Experience Deleted Successfully' : 'An error occurred',
                alertType: response == 's' ? 'success' : 'error'
            });
        } else if (redirectFrom == 'e_a') {
            res.render('candidate_profile', {
                view: 'profile',
                data: userData,
                showAlert: true,
                alertMessage: response == 's' ? 'Education Added' : 'Education not added',
                alertType: response == 's' ? 'success' : 'error'
            });
        } else if (redirectFrom == 'e_d') {
            res.render('candidate_profile', {
                view: 'profile',
                data: userData,
                showAlert: true,
                alertMessage: response == 's' ? 'Education Deleted' : 'An error occurred',
                alertType: response == 's' ? 'success' : 'error'
            });
        } else if (redirectFrom == 'e_e') {
            res.render('candidate_profile', {
                view: 'profile',
                data: userData,
                showAlert: true,
                alertMessage: response == 's' ? 'Education Saved Successfully' : 'Education edit failed',
                alertType: response == 's' ? 'success' : 'error'
            });
        } else if (redirectFrom == 'resume') {
            res.render('candidate_profile', {
                view: 'profile',
                data: userData,
                showAlert: true,
                alertMessage: response == 's' ? 'Resume Uploaded Successfully' : 'Resume upload failed',
                alertType: response == 's' ? 'success' : 'error'
            });
        }
    } else {
        res.render('candidate_profile', {
            view: 'profile',
            data: userData
        });
    }
});

router.get('/get-all-resume-info', function (req, res) {
    let userData = req.session.passport.user;

    _database2.default.query(_resume2.default.getResumeByUserIdQuery(userData.user_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            let resume = data[0];
            let resume_id = data[0].resume_id;

            _log4js2.default.log("resume - ");
            _log4js2.default.log(resume);

            //Get all Candidate Educations
            _database2.default.query(_resume2.default.getAllEducationByResumeIdQuery(resume_id), (err, data) => {
                if (err) {
                    _log4js2.default.log(err);
                } else {
                    let education = data;
                    _log4js2.default.log("education - ");
                    _log4js2.default.log(education);

                    //Get all Candidate WEs
                    _database2.default.query(_resume2.default.getAllWorkExperienceByResumeIdQuery(resume_id), (err, data) => {
                        if (err) {
                            _log4js2.default.log(err);
                        } else {
                            let work_experience = data;
                            _log4js2.default.log("work_experience - ");
                            _log4js2.default.log(work_experience);

                            //Get all Candidate Certifications
                            _database2.default.query(_resume2.default.getAllCertificationByResumeIdQuery(resume_id), (err, data) => {
                                if (err) {
                                    _log4js2.default.log(err);
                                } else {
                                    let certification = data;
                                    _log4js2.default.log("certification - ");
                                    _log4js2.default.log(certification);

                                    //Get all Candidate Specializations
                                    _database2.default.query(_resume2.default.getAllSpecializationByResumeIdQuery(resume_id), (err, data) => {
                                        if (err) {
                                            _log4js2.default.log(err);
                                        } else {
                                            let specialization = data;
                                            _log4js2.default.log("specialization - ");
                                            _log4js2.default.log(specialization);

                                            //Get all Candidate Skills
                                            _database2.default.query(_resume2.default.getAllSkillByResumeIdQuery(resume_id), (err, data) => {
                                                if (err) {
                                                    _log4js2.default.log(err);
                                                } else {
                                                    let skills = data;
                                                    _log4js2.default.log("skills - ");
                                                    _log4js2.default.log(skills);

                                                    _helpers2.default.calculateProfilePercentage(userData.user_id, userData, resume, education, work_experience, certification, skills);

                                                    res.status(200).json({
                                                        userData: userData,
                                                        resume: resume,
                                                        education: education,
                                                        work_experience: work_experience,
                                                        certification: certification,
                                                        specialization: specialization,
                                                        skills: skills
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get('/find-a-job', function (req, res) {
    _log4js2.default.log("find-a-job");
    let userData = req.session.passport.user;

    res.render('candidate_find_a_job', {
        view: 'find-a-job',
        data: userData
    });
});

router.get('/job-applications', function (req, res) {
    _log4js2.default.log("job-applications");
    let userData = req.session.passport.user;

    res.render('candidate_job_applications', {
        view: 'job-applications',
        data: userData
    });
});

router.get('/recommended-jobs', function (req, res) {
    _log4js2.default.log("recommended-jobs");

    let userData = req.session.passport.user;

    res.render('candidate_recommended_jobs', {
        view: 'recommended-jobs',
        data: userData
    });
});

router.get("/get-candidate-activity-history", (req, res, next) => {
    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let user = new _user2.default();
    _database2.default.query(user.getUserActivityHistory(user_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            for (let i = 0; i < data.length; i++) {
                data[i].date_time_ago = _helpers2.default.getCurrentTimeAgo(data[i].date_created);
            }
            res.status(200).json({
                message: "Activity History found.",
                activityHistory: data
            });
        }
    });
});

router.get("/get-candidate-statistics", (req, res, next) => {
    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let user = new _user2.default();
    _database2.default.query(user.getCountOfCandidateApplications(user_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            let candidateJobApplicationsCount = data[0].count;

            _database2.default.query(user.getCountOfCandidateSavedJobs(user_id), (err, data) => {
                if (err) {
                    _log4js2.default.log(err);
                } else {
                    let candidateSavedJobsCount = data[0].count;

                    let job = new _job2.default();
                    job.jobRecommendationsCount(user_id, (err, data) => {
                        if (err) {
                            _log4js2.default.log(err);
                        } else {
                            let candidateRecommendedJobsCount = data;

                            res.status(200).json({
                                message: "Candidate Statistics.",
                                jobApplicationsCount: candidateJobApplicationsCount,
                                savedJobsCount: candidateSavedJobsCount,
                                recommendedJobsCount: candidateRecommendedJobsCount
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post("/upload-resume", (req, res, next) => {
    let user = req.session.passport.user;

    let form = new _formidable2.default.IncomingForm();

    /* form.on('fileBegin', function (name, file){
        if(file.name != ''){
            // Check if dir exist. If not create
            helpers.checkIfDirectoryExist(config.resume_upload_dir);
              let originalFileExtension = path.extname(file.name).toLowerCase();
              file.name = user.user_id + '_' + user.first_name + '_' + user.last_name + '_resume' +
                        originalFileExtension;
              file.path = config.resume_upload_dir + file.name;
        } 
    });
      form.on('file', function (name, file){
        if(file.name != ''){     
            //Upload additional file       
            logger.log('Uploaded ' + file.name);
              helpers.copyFile(file.path, config.main_assets_resume_dir);
        }
    }); */

    form.parse(req, function (err, fields, files) {
        if (err) {
            _log4js2.default.log(err);
        } else {
            _log4js2.default.log('##### fields #####');
            _log4js2.default.log(fields);
            _log4js2.default.log('##### files #####');
            _log4js2.default.log(files);

            let azureHelper = new _azure_helpers2.default();
            azureHelper.uploadResumeToAzure(files);

            let user_id = user.user_id;
            let resume_id = fields.resume_id;
            let resume_url = '';

            if (files.resume.name != '') {
                resume_url = _config2.default.azure_resume_url + files.resume.name;
            }

            let userObj = new _user2.default();
            _database2.default.query(userObj.updateResumeFileUrlQuery(user_id, resume_id, resume_url), (err, data) => {
                if (err) {
                    _log4js2.default.log(err);
                    _helpers2.default.saveActivityTrail(user_id, "Resume Upload", "Resume upload failed");
                    res.redirect('/candidates/profile?q=resume&r=f');
                } else {
                    _helpers2.default.saveActivityTrail(user_id, "Resume Upload", "Resume uploaded");
                    res.redirect('/candidates/profile?q=resume&r=s');
                }
            });
        }
    });

    form.on('error', function (name, file) {
        if (file.name != '') {
            _log4js2.default.log('Error Uploading file: ' + file.name);
        }
    });

    form.on('progress', function (bytesReceived, bytesExpected) {
        if (bytesReceived && bytesExpected) {
            let percent_complete = bytesReceived / bytesExpected * 100;
            _log4js2.default.log(percent_complete.toFixed(2));
        }
    });
});

router.post("/upload-profile-picture", (req, res, next) => {
    let userData = req.session.passport.user;

    let form = new _formidable2.default.IncomingForm();

    /* form.on('fileBegin', function (name, file){
        if(file.name != ''){
            // Check if dir exist. If not create
            helpers.checkIfDirectoryExist(config.profile_picture_upload_dir);
              let originalFileExtension = path.extname(file.name).toLowerCase();
              file.name = userData.user_id + '_' + userData.first_name + '_' + 
                        userData.last_name + '_profile_pic' + originalFileExtension;
              file.path = config.profile_picture_upload_dir + file.name;
        } 
    });  
      form.on('file', function (name, file){
        if(file.name != ''){     
            //Upload additional file       
            logger.log('Uploaded ' + file.name);
            helpers.copyFile(file.path, config.main_assets_profile_pic_dir);
        }
    }); */

    form.parse(req, function (err, fields, files) {
        if (err) {
            _log4js2.default.log(err);
        } else {
            let azureHelper = new _azure_helpers2.default();
            azureHelper.uploadProfilePictureToAzure(files);

            let user_id = userData.user_id;
            let profile_pic_url = '';
            let full_profile_pic_url = '';

            if (files.profile_picture.name != '') {
                profile_pic_url = files.profile_picture.name;
                full_profile_pic_url = _config2.default.azure_profile_pic_url + profile_pic_url;
            }

            let user = new _user2.default();
            _database2.default.query(user.updateProfilePictureUrlQuery(user_id, full_profile_pic_url), (err, data) => {
                if (err) {
                    _log4js2.default.log(err);
                    _helpers2.default.saveActivityTrail(user_id, "Profile Picture Upload", "Profile Picture upload failed");

                    res.status(200).json({
                        status: 'failed'
                    });
                } else {
                    _helpers2.default.saveActivityTrail(user_id, "Profile Picture Upload", "Profile Picture Uploaded");

                    /*sessionStore.saveCandidateData(req, user_id, userData.user_uuid, userData.first_name, 
                        userData.last_name, userData.email, userData.phone_number, userData.user_role, 
                        userData.is_logged_in, userData.is_activated, userData.resume_id, userData.is_first_login, 
                        userData.gender, userData.tagline, userData.address, full_profile_pic_url); */

                    //.saveProfilePicture(req, full_profile_pic_url);

                    req.session.passport.user = {
                        user_id: userData.user_id,
                        user_uuid: userData.user_uuid,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        username: userData.username,
                        other_name: userData.other_name,
                        email: userData.email,
                        phone_number: userData.phone_number,
                        address: userData.address,
                        state: userData.state,
                        country: userData.country,
                        gender: userData.gender,
                        dob: userData.dob,
                        profile_completeness: userData.profile_completeness,
                        photo_url: full_profile_pic_url,
                        social_media_id: userData.social_media_id,
                        company: userData.company,
                        tagline: userData.tagline,
                        industry: userData.industry,
                        password: userData.password,
                        last_login_time: userData.last_login_time,
                        last_login_ip_address: userData.last_login_ip_address,
                        date_created: userData.date_created,
                        is_activated: userData.is_activated,
                        is_password_set: userData.is_password_set,
                        activation_token: userData.activation_token,
                        invite_token: userData.invite_token,
                        is_invite_token_active: userData.is_invite_token_active,
                        is_first_login: userData.is_first_login,
                        role_id: userData.role_id,
                        resume_id: userData.resume_id
                    };

                    res.status(200).json({
                        status: 'success',
                        message: "Profile picture uploaded.",
                        photo_url: full_profile_pic_url
                    });
                }
            });
        }
    });

    form.on('error', function (name, file) {
        if (file.name != '') {
            _log4js2.default.log('Error Uploading file: ' + file.name);
        }
    });

    form.on('progress', function (bytesReceived, bytesExpected) {
        if (bytesReceived && bytesExpected) {
            let percent_complete = bytesReceived / bytesExpected * 100;
            _log4js2.default.log(percent_complete.toFixed(2));
        }
    });
});

router.get('/saved-jobs', function (req, res) {
    _log4js2.default.log("saved-jobs");
    let userData = req.session.passport.user;

    res.render('candidate_saved_jobs', {
        view: 'saved-jobs',
        data: userData
    });
});

router.get('/get-all-saved-jobs', function (req, res) {
    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let user = new _user2.default();
    _database2.default.query(user.getAllCandidatesSavedJobs(user_id), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "All Saved Jobs.",
                jobs: data
            });
        }
    });
});

router.post("/remove-saved-job", (req, res, next) => {
    let saved_job_id = req.body.saved_job_id;

    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let job = new _job2.default();
    _database2.default.query(job.removeSavedJob(saved_job_id), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {

                _helpers2.default.saveActivityTrail(user_id, "Job Removed", "You removed a job from your saved jobs");

                res.status(200).json({
                    message: 'Job Removed.',
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message: "Job Not found."
                });
            }
        }
    });
});

router.get('/settings', function (req, res) {
    _log4js2.default.log("settings");
    let userData = req.session.passport.user;

    _log4js2.default.log(userData);

    let redirectFrom = req.query.f;
    let response = req.query.r;

    if (typeof redirectFrom != 'undefined' && redirectFrom) {
        if (redirectFrom == 'u_pp') {
            res.render('candidate_settings', {
                view: 'settings',
                data: userData,
                showAlert: true,
                alertMessage: response == 's' ? 'Profile picture updated successfully' : 'An error occurred',
                alertType: response == 's' ? 'success' : 'error'
            });
        }
    } else {
        res.render('candidate_settings', {
            view: 'settings',
            data: userData
        });
    }
});

router.post("/add", (req, res, next) => {
    'use strict';

    //read user information from request

    let user = new _user2.default();

    let user_uuid = (0, _v2.default)();
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone_number = req.body.phone_number;
    let photo_url = req.body.photo_url;
    let social_media_id = req.body.social_media_id;
    let password = req.body.password;

    let username = '';
    let other_name = '';
    let gender = '';
    let dob = '';
    let profile_completeness = '';
    let tagline = '';
    let address = '';

    _database2.default.query(_user2.default.checkIfEmailExist(email), (err, data) => {
        if (!err) {
            if (data && data.length > 0) {
                res.redirect('/register?v=f');
            } else {
                let is_activated = _config2.default.not_activated;

                _database2.default.query(user.createUserQuery(user_uuid, first_name, last_name, username, other_name, email, phone_number, gender, dob, profile_completeness, photo_url, social_media_id, tagline, password, is_activated), (err, data) => {
                    if (!err) {
                        if (data) {
                            let user_id = data.insertId;
                            _log4js2.default.log("User inserted");

                            _database2.default.query(_user2.default.insertUserRole(user_id, _config2.default.candidate_role_tag), (err, data) => {
                                if (!err) {

                                    _log4js2.default.log("UserRole inserted");

                                    let resume = new _resume2.default();

                                    _database2.default.query(resume.createResumeQuery(user_id), (err, data) => {
                                        if (!err) {
                                            _log4js2.default.log("UserResume Created");

                                            let is_logged_in = true;
                                            let resume_id = data.insertId;
                                            let is_first_login = _config2.default.true;

                                            //Save user id
                                            //sessionStore.saveUserId(req, user_id);  

                                            //saving user data in session
                                            //sessionStore.saveCandidateData(req, user_id, user_uuid, first_name, last_name, email, 
                                            //    phone_number, config.candidate_role_tag, is_logged_in, is_activated, resume_id,
                                            //    is_first_login, gender, tagline, address, photo_url);
                                            // logger.log(req.session)
                                            // req.session.passport.user.user_id = user_id;

                                            let userData = {
                                                user_id: user_id,
                                                user_uuid: user_uuid,
                                                first_name: first_name,
                                                last_name: last_name,
                                                full_name: first_name + ' ' + last_name,
                                                email: email,
                                                phone_number: phone_number,
                                                user_role: _config2.default.candidate_role_tag,
                                                is_logged_in: is_logged_in,
                                                is_activated: is_activated,
                                                resume_id: resume_id,
                                                is_first_login: is_first_login,
                                                gender: gender,
                                                tagline: tagline,
                                                address: address,
                                                profile_picture: photo_url
                                            };

                                            //Save Activity Trail
                                            _helpers2.default.saveActivityTrail(user_id, "Register", "Registration Completed.");

                                            let resumeEducation = {};
                                            let resumeWorkExperience = {};
                                            let resumeCertification = {};
                                            let resumeSkill = {};

                                            // process profile percentage
                                            _helpers2.default.calculateProfilePercentage(user_id, userData, resume, resumeEducation, resumeWorkExperience, resumeCertification, resumeSkill);

                                            // send welcome mail
                                            let fullname = first_name + ' ' + last_name;
                                            _mailer2.default.sendWelcomeMail(req, user_id, fullname, email);

                                            // Redirect to login authentication to load session
                                            let redirect_link = '/auth/login?username=' + email + '&password=' + password;
                                            res.redirect(redirect_link);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});

router.post("/update", (req, res, next) => {
    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    if (req.body.current_password) {
        changePassword(req, res, user_id, userData);
    } else {
        updateAllProfile(req, res, user_id, userData);
    }
});

function updateAllProfile(req, res, user_id, userData) {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone_number = req.body.phone_number;
    let address = req.body.address;
    let gender = req.body.gender;
    let dob = req.body.dob;
    let tagline = req.body.tagline;
    let state = req.body.state;
    let country = req.body.country;
    let industry = req.body.industry;

    let user = new _user2.default();
    _database2.default.query(user.updateCandidateQuery(user_id, first_name, last_name, email, phone_number, address, gender, dob, tagline, state, country, industry), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {

                _helpers2.default.saveActivityTrail(user_id, "Profile Updated", "You updated your profile.");

                //Save back to session
                req.session.passport.user = {
                    user_id: userData.user_id,
                    user_uuid: userData.user_uuid,
                    first_name: first_name,
                    last_name: last_name,
                    username: userData.username,
                    other_name: userData.other_name,
                    email: email,
                    phone_number: phone_number,
                    address: address,
                    state: state,
                    country: country,
                    gender: gender,
                    dob: dob,
                    profile_completeness: userData.profile_completeness,
                    photo_url: userData.photo_url,
                    social_media_id: userData.social_media_id,
                    company: userData.company,
                    tagline: tagline,
                    industry: industry,
                    password: userData.password,
                    last_login_time: userData.last_login_time,
                    last_login_ip_address: userData.last_login_ip_address,
                    date_created: userData.date_created,
                    is_activated: userData.is_activated,
                    is_password_set: userData.is_password_set,
                    activation_token: userData.activation_token,
                    invite_token: userData.invite_token,
                    is_invite_token_active: userData.is_invite_token_active,
                    is_first_login: userData.is_first_login,
                    role_id: userData.role_id,
                    resume_id: userData.resume_id
                };

                userData = req.session.passport.user;

                res.render('candidate_settings', {
                    view: 'settings',
                    data: userData,
                    showAlert: true,
                    alertMessage: "Profile updated successfully.",
                    alertType: "success"
                });
            } else {
                res.render('candidate_settings', {
                    view: 'settings',
                    data: userData,
                    showAlert: true,
                    alertMessage: "An error occurred updating your profile.",
                    alertType: "error"
                });
            }
        }
    });
}

function changePassword(req, res, user_id, userData) {
    _log4js2.default.log("in update password ooo");
    let current_password = req.body.current_password;
    let new_password = req.body.new_password;

    _database2.default.query(_user2.default.getUserPasswordQuery(user_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else if (!data) {
            _log4js2.default.log("incorrect password");
            res.render('candidate_settings', {
                view: 'settings',
                data: userData,
                showAlert: true,
                alertMessage: "Incorrect Password",
                alertType: "error"
            });
        } else {
            if (data.length > 0) {
                if (!_bcryptjs2.default.compareSync(current_password, data[0].password)) {
                    _log4js2.default.log("Password does not match");

                    res.render('candidate_settings', {
                        view: 'settings',
                        data: userData,
                        showAlert: true,
                        alertMessage: "Password does not match",
                        alertType: "error"
                    });
                } else {
                    _log4js2.default.log("about to update");
                    _database2.default.query(_user2.default.updatePasswordQuery(user_id, new_password), (err, data) => {
                        if (!err) {
                            if (data && data.affectedRows > 0) {

                                _helpers2.default.saveActivityTrail(user_id, "Password", "Password has been changed successfully.");

                                res.render('candidate_settings', {
                                    view: 'settings',
                                    data: userData,
                                    showAlert: true,
                                    alertMessage: "Password changed Successfully",
                                    alertType: "success"
                                });
                            } else {
                                res.render('candidate_settings', {
                                    view: 'settings',
                                    data: userData,
                                    showAlert: true,
                                    alertMessage: "An Error Occurred. Please try again.",
                                    alertType: "error"
                                });
                            }
                        }
                    });
                }
            }
        }
    });
}

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

router.get("/get-profile-percentage", (req, res, next) => {
    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    _database2.default.query(_user2.default.getProfilePercentage(user_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            res.status(200).json({
                message: "Candidate profile percentage.",
                profile_completeness: data[0].profile_completeness
            });
        }
    });
});

module.exports = router;