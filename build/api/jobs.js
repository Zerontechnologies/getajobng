'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _database = require('../db/database');

var _database2 = _interopRequireDefault(_database);

var _job = require('../models/job');

var _job2 = _interopRequireDefault(_job);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _helpers = require('../config/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _config = require('./../config/config');

var _config2 = _interopRequireDefault(_config);

var _formidable = require('formidable');

var _formidable2 = _interopRequireDefault(_formidable);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mailer = require('../config/mail/mailer');

var _mailer2 = _interopRequireDefault(_mailer);

var _log4js = require('./../config/log4js');

var _log4js2 = _interopRequireDefault(_log4js);

var _azure_helpers = require('../config/azure_helpers');

var _azure_helpers2 = _interopRequireDefault(_azure_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.use((0, _cookieParser2.default)());
router.use(_bodyParser2.default.json());
router.use(_bodyParser2.default.urlencoded({ extended: false }));

router.use((0, _expressSession2.default)({
    secret: _config2.default.session_secret,
    resave: _config2.default.session_resave,
    key: _config2.default.session_key,
    saveUninitialized: _config2.default.session_save_uninitialized,
    cookie: { maxAge: _config2.default.session_cookie_max_age }
}));

router.get("/", (req, res, next) => {

    _database2.default.query(_job2.default.getAllJobsQuery(), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "All Jobs listed.",
                jobs: data
            });
        }
    });
});

router.get("/get-all-jobs", (req, res, next) => {

    _database2.default.query(_job2.default.getAllJobsQuery(), (err, data) => {
        if (!err) {
            for (let i = 0; i < data.length; i++) {
                data[i].date_time_ago = _helpers2.default.getCurrentTimeAgo(data[i].date_created);
            }

            res.status(200).json({
                message: "All Jobs listed.",
                jobs: data
            });
        }
    });
});

router.get("/get-all-job-filters", (req, res, next) => {

    _database2.default.query(_job2.default.getAllIndustries(), (err, data) => {
        if (!err) {
            let allIndustry = data;

            _database2.default.query(_job2.default.getAllStates(), (err, data) => {
                if (!err) {
                    let allStates = data;

                    _database2.default.query(_job2.default.getAllJobTypes(), (err, data) => {
                        if (!err) {
                            let allJobTypes = data;

                            _database2.default.query(_job2.default.getAllJobCategories(), (err, data) => {
                                if (!err) {
                                    let allJobCategories = data;

                                    _database2.default.query(_job2.default.getAllSkills(), (err, data) => {
                                        if (!err) {
                                            let allSkills = data;

                                            res.status(200).json({
                                                message: "All Job Filters.",
                                                industries: allIndustry,
                                                states: allStates,
                                                jobTypes: allJobTypes,
                                                jobCategories: allJobCategories,
                                                skills: allSkills
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

router.get("/get-all-states", (req, res, next) => {

    _database2.default.query(_job2.default.getAllStates(), (err, data) => {
        if (!err) {
            let allStates = data;

            res.status(200).json({
                message: "All States.",
                states: allStates
            });
        }
    });
});

router.get("/get-all-job-types", (req, res, next) => {

    _database2.default.query(_job2.default.getAllJobTypes(), (err, data) => {
        if (!err) {
            let allJobTypes = data;

            res.status(200).json({
                message: "All Job Types.",
                job_types: allJobTypes
            });
        }
    });
});

router.get("/get-all-job-post-params", (req, res, next) => {

    _database2.default.query(_job2.default.getAllStates(), (err, data) => {
        if (!err) {
            let allStates = data;

            _database2.default.query(_job2.default.getAllJobTypes(), (err, data) => {
                if (!err) {
                    let allJobTypes = data;

                    _database2.default.query(_job2.default.getAllJobCategories(), (err, data) => {
                        if (!err) {
                            let allJobCategories = data;

                            _database2.default.query(_job2.default.getAllIndustries(), (err, data) => {
                                if (!err) {
                                    let allIndustries = data;

                                    _database2.default.query(_job2.default.getAllQualifications(), (err, data) => {
                                        if (!err) {
                                            let allQualifications = data;

                                            _database2.default.query(_job2.default.getAllExperienceLevel(), (err, data) => {
                                                if (!err) {
                                                    let allExperienceLevel = data;

                                                    _database2.default.query(_job2.default.getAllSkill(), (err, data) => {
                                                        if (!err) {
                                                            let allSkills = data;

                                                            _database2.default.query(_job2.default.getAllShortlistParams(), (err, data) => {
                                                                if (!err) {
                                                                    let allShortlistParams = data;

                                                                    _database2.default.query(_job2.default.getAllCountries(), (err, data) => {
                                                                        if (!err) {
                                                                            let allCountries = data;

                                                                            res.status(200).json({
                                                                                message: "All Data.",
                                                                                states: allStates,
                                                                                countries: allCountries,
                                                                                jobTypes: allJobTypes,
                                                                                jobCategories: allJobCategories,
                                                                                industries: allIndustries,
                                                                                qualifications: allQualifications,
                                                                                experienceLevel: allExperienceLevel,
                                                                                skills: allSkills,
                                                                                shortlistParams: allShortlistParams
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
                        }
                    });
                }
            });
        }
    });
});

router.get("/get-all-cv-search-params", (req, res, next) => {

    _database2.default.query(_job2.default.getAllStates(), (err, data) => {
        if (!err) {
            let allStates = data;

            _database2.default.query(_job2.default.getAllQualifications(), (err, data) => {
                if (!err) {
                    let allQualifications = data;

                    res.status(200).json({
                        message: "All Data.",
                        states: allStates,
                        qualifications: allQualifications
                    });
                }
            });
        }
    });
});

router.get("/get-all-industries", (req, res, next) => {

    _database2.default.query(_job2.default.getAllIndustries(), (err, data) => {
        if (!err) {
            let allIndustries = data;

            res.status(200).json({
                message: "All Data.",
                industries: allIndustries
            });
        }
    });
});

router.get("/get-all-application-status", (req, res, next) => {

    _database2.default.query(_job2.default.getAllApplicationStatus(), (err, data) => {
        if (!err) {
            let allApplicationStatus = data;

            res.status(200).json({
                message: "All Application Status.",
                applicationStatus: allApplicationStatus
            });
        }
    });
});

router.get("/get-all-candidate-job-applications", (req, res, next) => {
    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    _database2.default.query(_job2.default.getAllCandidateJobApplications(user_id), (err, data) => {
        if (!err) {

            for (let i = 0; i < data.length; i++) {
                data[i].date_applied = _helpers2.default.formatDateTime(data[i].date_created);
            }

            res.status(200).json({
                message: "All Job Applications.",
                jobs: data
            });
        }
    });
});

router.get("/filter-jobs", (req, res, next) => {
    let industry_params = req.query.f_industry;
    let skill_params = req.query.f_skill;
    let state_params = req.query.f_state;
    let job_type_params = req.query.f_job_type;
    let job_category_params = req.query.f_job_category;

    _log4js2.default.log(industry_params);
    _log4js2.default.log(state_params);
    _log4js2.default.log(job_type_params);
    _log4js2.default.log(job_category_params);

    let job = new _job2.default();
    let filterJobsQuery = job.getFilterJobsProcessQuery(industry_params, skill_params, state_params, job_type_params, job_category_params);

    _database2.default.query(filterJobsQuery, (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            for (let i = 0; i < data.length; i++) {
                data[i].date_time_ago = _helpers2.default.getCurrentTimeAgo(data[i].date_created);
            }

            res.status(200).json({
                message: "All Filtered Jobs listed.",
                jobs: data
            });
        }
    });
});

router.get("/keyword-search", (req, res, next) => {
    let keyword = req.query.keyword;

    _database2.default.query(_job2.default.keywordSearch(keyword), (err, data) => {
        if (!err) {
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    data[i].date_time_ago = _helpers2.default.getCurrentTimeAgo(data[i].date_created);
                }

                res.status(200).json({
                    message: "All Jobs listed.",
                    jobs: data
                });
            } else {
                res.status(200).json({
                    message: "Jobs Not found.",
                    jobs: data
                });
            }
        }
    });
});

router.get("/get-candidate-job-recommendations", (req, res, next) => {
    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let filter = req.query.filter;

    let job = new _job2.default();
    if (typeof filter != 'undefined' && filter) {
        job.jobRecommendationProcessWithFilter(user_id, filter, (err, data) => {
            if (err) {
                _log4js2.default.log(err);
            } else {
                for (let i = 0; i < data.length; i++) {
                    data[i].date_time_ago = _helpers2.default.getCurrentTimeAgo(data[i].date_created);

                    let job_id = data[i].job_id;

                    //let total_score = job.percentageMatchProcess(user_id, job_id);
                    //let percentage_match = Math.round(((total_score / 40) * 100) * 10) /10;  // 40 is the highest score
                    //logger.log('percentage_match - ' + percentage_match);

                    //data[i].percentage_score = percentage_match;
                }

                res.status(200).json({
                    message: "Jobs found.",
                    recommendedJobs: data
                });
            }
        });
    } else {
        job.jobRecommendationProcess(user_id, (err, data) => {
            if (err) {
                _log4js2.default.log(err);
            } else {
                for (let i = 0; i < data.length; i++) {
                    data[i].date_time_ago = _helpers2.default.getCurrentTimeAgo(data[i].date_created);

                    let job_id = data[i].job_id;

                    //let total_score = job.percentageMatchProcess(user_id, job_id);
                    //let percentage_match = Math.round(((total_score / 40) * 100) * 10) /10;  // 40 is the highest score
                    //logger.log('percentage_match - ' + percentage_match);

                    //data[i].percentage_score = percentage_match;
                }

                res.status(200).json({
                    message: "Jobs found.",
                    recommendedJobs: data
                });
            }
        });
    }
});

router.get("/get-candidate-job-recommendations-for-dashboard", (req, res, next) => {
    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let job = new _job2.default();
    job.jobRecommendationProcessForDashboard(user_id, (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            for (let i = 0; i < data.length; i++) {
                data[i].date_time_ago = _helpers2.default.getCurrentTimeAgo(data[i].date_created);

                let job_id = data[i].job_id;

                //let total_score = job.percentageMatchProcess(user_id, job_id);
                //let percentage_match = Math.round(((total_score / 40) * 100) * 10) /10;  // 40 is the highest score
                //logger.log('percentage_match - ' + percentage_match);

                //data[i].percentage_score = percentage_match;
            }

            res.status(200).json({
                message: "Jobs found.",
                recommendedJobs: data
            });
        }
    });
});

router.get('/get-last-5-jobs', function (req, res) {
    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    _database2.default.query(_job2.default.getRecruiterLast5PostedJobs(user_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            for (let i = 0; i < data.length; i++) {
                data[i].date_time_ago = _helpers2.default.getCurrentTimeAgo(data[i].date_created);
            }
            res.status(200).json({
                message: "Posted Jobs.",
                jobs: data
            });
        }
    });
});

router.get('/get-all-recruiter-posted-jobs', function (req, res) {
    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    _database2.default.query(_job2.default.getAllRecruiterPostedJobs(user_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            for (let i = 0; i < data.length; i++) {
                data[i].date_time_ago = _helpers2.default.getCurrentTimeAgo(data[i].date_created);
                data[i].application_deadline = _helpers2.default.formatDateTime(data[i].application_deadline);
            }
            res.status(200).json({
                message: "Posted Jobs.",
                jobs: data
            });
        }
    });
});

router.get('/job-detail/:jobId', function (req, res) {
    let jobId = req.params.jobId;
    let p = req.query.p;

    _database2.default.query(_job2.default.getJobByIdQuery(jobId), (err, data) => {
        if (!err) {
            // sAVE data[0] to a var and checkIfUserAppliedToJob

            let jobData = data[0];
            let userData = req.session.passport.user;
            let user_id = userData.user_id;

            jobData.job_description = jobData.job_description.substring(0, jobData.job_description.length - 1);
            jobData.job_responsibilities = jobData.job_responsibilities.substring(0, jobData.job_responsibilities.length - 1);

            if (typeof jobData.job_responsibilities === 'undefined' || jobData.job_responsibilities == '' || jobData.job_responsibilities == null || jobData.job_responsibilities == 'null') {

                jobData.job_description = jobData.job_description;
            } else {
                jobData.job_description = jobData.job_description + "<br><br><h6>Job Responsibilities</h6><br>" + jobData.job_responsibilities;
            }

            jobData.job_description = _helpers2.default.unescapeHTML(jobData.job_description);

            jobData.application_deadline = _helpers2.default.checkApplicationDeadline(jobData.application_deadline);

            let job = new _job2.default();
            _database2.default.query(job.checkIfUserAppliedToJob(jobId, user_id), (err, data) => {
                if (!err) {
                    if (data && data.length > 0) {
                        if (typeof p != 'undefined' && p) {
                            if (p == 's') {
                                res.render('candidate_job_detail', {
                                    view: 'find-a-job',
                                    data: userData,
                                    jobData: jobData,
                                    showAlert: true,
                                    alertMessage: "Job Application Successful",
                                    alertType: "success"
                                });
                            } else if (p == 'f') {
                                res.render('candidate_job_detail', {
                                    view: 'find-a-job',
                                    data: userData,
                                    jobData: jobData,
                                    showAlert: true,
                                    alertMessage: "Job Application Failed.",
                                    alertType: "error"
                                });
                            }
                        } else {
                            res.render('candidate_job_detail', {
                                view: 'find-a-job',
                                data: userData,
                                jobData: jobData
                            });
                        }
                    } else {
                        res.status(200).json({
                            message: "Job Not found."
                        });
                    }
                }
            });
        }
    });
});

router.post('/check-application-status', function (req, res) {
    let job_id = req.body.job_id;
    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let job = new _job2.default();
    _database2.default.query(job.checkIfUserAppliedToJob(job_id, user_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            res.status(200).json({
                message: "Application Status",
                application_status: data[0].count
            });
        }
    });
});

router.post("/processapply", (req, res, next) => {
    let user = req.session.passport.user;

    let form = new _formidable2.default.IncomingForm();

    /* form.on('fileBegin', function (name, file){
        if(file.name != ''){
            // Check if dir exist. If not create
            helpers.checkIfDirectoryExist(config.additional_resume_upload_dir);
              let originalFileExtension = path.extname(file.name).toLowerCase();
              file.name = user.user_id + '_' + user.first_name + '_' + user.last_name + '_additional_file' +
                        originalFileExtension;
              file.path = config.additional_resume_upload_dir + file.name;
        } 
    });
      form.on('file', function (name, file){
        if(file.name != ''){     
            //Upload additional file       
            logger.log('Uploaded ' + file.name);
            helpers.copyFile(file.path, config.main_assets_additional_resume_dir);
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
            azureHelper.uploadAdditionalFilesToAzure(files);

            let user_id = user.user_id;
            let user_email = user.email;
            let user_full_name = user.first_name + ' ' + user.last_name;

            let job_id = fields.job_id;
            let job_title = fields.job_title;
            let cover_letter = fields.cover_letter;
            let additional_resume_url = '';

            if (files.additional_file.name != '') {
                additional_resume_url = _config2.default.azure_additional_files_url + files.additional_file.name;
            }

            cover_letter = cover_letter.replace("'", "\\'");

            let job = new _job2.default();
            _database2.default.query(job.applyForJobQuery(job_id, user_id, cover_letter, additional_resume_url), (err, data) => {
                if (err) {
                    _log4js2.default.log(err);
                    _helpers2.default.saveActivityTrail(user_id, "Job Application", "Job Application to - " + job_title + " failed");
                    res.redirect('/jobs/job-detail/' + job_id + '?p=f');
                } else {
                    _helpers2.default.saveActivityTrail(user_id, "Job Application", "You applied to the " + job_title + " role");

                    _mailer2.default.sendJobApplicationMail(user_full_name, user_email, job_title);

                    res.redirect('/jobs/job-detail/' + job_id + '?p=s');
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

router.get('/apply/:jobId', function (req, res) {
    let jobId = req.params.jobId;
    let userData = req.session.passport.user;

    let user = new _user2.default();
    _database2.default.query(user.getCandidateCV(userData.user_id), (err, data) => {
        if (!err) {
            let candidate_resume_url = typeof data[0].resume_file_url != 'undefined' && data[0].resume_file_url && data[0].resume_file_url != '' && data[0].resume_file_url != null ? data[0].resume_file_url : 'false';

            _database2.default.query(_job2.default.getJobByIdQuery(jobId), (err, data) => {
                if (!err) {
                    if (data && data.length > 0) {
                        res.render('job_application_page', {
                            view: 'find-a-job',
                            data: userData,
                            jobData: data[0],
                            candidate_resume_url: candidate_resume_url
                        });
                    } else {
                        res.status(200).json({
                            message: "Job Not found."
                        });
                    }
                }
            });
        }
    });
});

router.post("/create-job", (req, res, next) => {

    let job_title = req.body.job_title;
    let job_type = req.body.job_type;
    let job_category = req.body.job_category;
    let location = req.body.location;
    let industry = req.body.industry;
    let job_description = req.body.job_description;
    let job_responsibilities = req.body.job_responsibilities;
    let min_qualification = req.body.min_qualification;
    let experience_level = req.body.experience_level;
    let min_year_of_experience = req.body.min_year_of_experience;
    let max_year_of_experience = req.body.max_year_of_experience;
    let expected_salary = req.body.expected_salary;
    let gender_type = req.body.gender_type;
    let application_deadline = req.body.application_deadline;
    let minimum_age = req.body.minimum_age;
    let maximum_age = req.body.maximum_age;
    let required_skills = req.body.required_skills;
    let shortlist_params = req.body.shortlist_params;

    let recruiterData = req.session.passport.user;
    let user_id = recruiterData.user_id;
    let recruiter_full_name = recruiterData.company_name;
    let recruiter_email = recruiterData.email;
    let company_id = recruiterData.company_id;

    let default_country_id = 156; //Make Nigeria default

    let job = new _job2.default();
    _database2.default.query(job.createJobQuery(job_title, company_id, default_country_id, job_type, job_category, location, industry, job_description, job_responsibilities, min_qualification, experience_level, min_year_of_experience, max_year_of_experience, expected_salary, gender_type, application_deadline, minimum_age, maximum_age, required_skills, shortlist_params, user_id), (err, data) => {

        if (!err) {
            _helpers2.default.saveActivityTrail(user_id, "Job Posted", 'Your Job ' + job_title + ' has been posted.');

            let job_id = data.insertId;

            _log4js2.default.log("job_id - " + job_id);

            _mailer2.default.sendJobPostedMail(req, recruiter_email, recruiter_full_name, job_id, job_title);

            res.status(200).json({
                message: "Job added.",
                jobId: data.insertId
            });
        }
    });
});

router.post("/edit-job-post", (req, res, next) => {

    let job_id = req.body.job_id;
    let job_title = req.body.job_title;
    let job_type = req.body.job_type;
    let job_category = req.body.job_category;
    let location = req.body.location;
    let industry = req.body.industry;
    let job_description = req.body.job_description;
    let job_responsibilities = req.body.job_responsibilities;
    let min_qualification = req.body.min_qualification;
    let experience_level = req.body.experience_level;
    let min_year_of_experience = req.body.min_year_of_experience;
    let max_year_of_experience = req.body.max_year_of_experience;
    let expected_salary = req.body.expected_salary;
    let gender_type = req.body.gender_type;
    let application_deadline = req.body.application_deadline;
    let minimum_age = req.body.minimum_age;
    let maximum_age = req.body.maximum_age;
    let required_skills = req.body.required_skills;
    let shortlist_params = req.body.shortlist_params;

    let recruiterData = req.session.passport.user;
    let user_id = recruiterData.user_id;
    let recruiter_full_name = recruiterData.full_name;
    let recruiter_email = recruiterData.email;
    let company_id = recruiterData.company_id;

    let default_country_id = 156; //Make Nigeria default

    let job = new _job2.default();
    _database2.default.query(job.editJobPostQuery(job_id, job_title, job_type, job_category, location, industry, job_description, job_responsibilities, min_qualification, experience_level, min_year_of_experience, max_year_of_experience, expected_salary, gender_type, application_deadline, minimum_age, maximum_age, required_skills, shortlist_params), (err, data) => {

        if (!err) {
            _helpers2.default.saveActivityTrail(user_id, "Job Post Edited", 'Your edited your job post: (' + job_title + ').');

            //let job_id = data.insertId;

            //logger.log("job_id - " + job_id)

            //mailer.sendJobPostedMail(req, recruiter_email, recruiter_full_name, job_id, job_title);

            res.status(200).json({
                message: "Job edited.",
                result: true
            });
        }
    });
});

router.post("/search-job-old", (req, res, next) => {
    let keyword = req.body.keyword;
    let industry = req.body.industry;
    //let state = req.body.state;
    //let country = req.body.country;
    let location = req.body.location;

    _database2.default.query(_job2.default.searchJobsQuery(keyword, location), (err, data) => {
        if (!err) {
            if (data.length > 0) {
                res.status(200).json({
                    message: `Jobs found.`,
                    searchedJobs: data
                });
            } else {
                res.status(200).json({
                    message: "Job Not found."
                });
            }
        }
    });
});

router.post("/search-job", (req, res, next) => {
    let keyword = req.body.keyword;
    let industry = req.body.industry;
    //let state = req.body.state;
    //let country = req.body.country;
    let location = req.body.location;

    res.redirect('/find-a-job?search=' + keyword);
});

router.post("/save-job", (req, res, next) => {
    //read user information from request
    let job_id = req.body.job_id;
    let user_id = req.body.user_id;

    _database2.default.query(_job2.default.saveJobQuery(job_id, user_id), (err, data) => {
        _helpers2.default.saveActivityTrail(user_id, "Job Saved", "You saved a Job post with job_id - " + job_id);
        res.status(200).json({
            message: "Job added to wishlist.",
            savedJobId: data.insertId
        });
    });
});

router.post("/delete-job", (req, res, next) => {
    let job_id = req.body.job_id;
    let job_title = req.body.job_title;

    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    _database2.default.query(_job2.default.deleteJobByIdQuery(job_id), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {

                _helpers2.default.saveActivityTrail(user_id, "Job Deleted", "You deleted a Job post titled (" + job_title + ")");

                res.status(200).json({
                    message: 'Job deleted.',
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

router.post("/get-all-job-applicants", (req, res, next) => {
    let job_id = req.body.job_id;

    _database2.default.query(_job2.default.getAllJobApplicants(job_id), (err, data) => {
        if (!err) {
            let applicants_list = data;

            for (let i = 0; i < applicants_list.length; i++) {
                applicants_list[i].date_created = _helpers2.default.formatDateTime(applicants_list[i].date_created);
                applicants_list[i].date_applied = _helpers2.default.formatDateTime(applicants_list[i].date_applied);
            }

            res.status(200).json({
                message: "All Applicants",
                applicants: data
            });
        }
    });
});

router.post("/get-all-shortlisted-job-applicants", (req, res, next) => {
    let job_id = req.body.job_id;

    _database2.default.query(_job2.default.getAllShortlistedJobApplicants(job_id), (err, data) => {
        if (!err) {
            for (let i = 0; i < data.length; i++) {
                data[i].date_created = _helpers2.default.formatDateTime(data[i].date_created);
                data[i].date_applied = _helpers2.default.formatDateTime(data[i].date_applied);
            }
            res.status(200).json({
                message: "All Shortlisted Applicants",
                applicants: data
            });
        }
    });
});

router.get("/shortlist", (req, res, next) => {

    let user_id = 59;
    let job_id = 3081;

    let job = new _job2.default();
    job.newShortlistProcess(res, user_id, job_id);
    //job.percentageMatchProcess(user_id, job_id)
});

router.get("/:jobId", (req, res, next) => {
    let jobId = req.params.jobId;

    _database2.default.query(_job2.default.getJobByIdQuery(jobId), (err, data) => {
        if (!err) {
            if (data && data.length > 0) {

                res.status(200).json({
                    message: "Job found.",
                    job: data
                });
            } else {
                res.status(200).json({
                    message: "Job Not found."
                });
            }
        }
    });
});

module.exports = router;