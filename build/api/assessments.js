"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _database = require("../db/database");

var _database2 = _interopRequireDefault(_database);

var _assessment = require("../models/assessment");

var _assessment2 = _interopRequireDefault(_assessment);

var _job = require("../models/job");

var _job2 = _interopRequireDefault(_job);

var _config = require("../config/config");

var _config2 = _interopRequireDefault(_config);

var _helpers = require("./../config/helpers");

var _helpers2 = _interopRequireDefault(_helpers);

var _log4js = require("./../config/log4js");

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.get("/", (req, res, next) => {

    _database2.default.query(_assessment2.default.getAllAssessmentsQuery(), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "Assessments listed.",
                assessments: data
            });
        }
    });
});

router.post("/add", (req, res, next) => {
    //read user information from request

    let assessment_name = req.body.assessment_name;
    let assessment_type = req.body.assessment_type;
    let job_assigned_to = req.body.job_assigned_to;
    let description = req.body.assessment_description;
    let timer = req.body.assessment_time;

    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let assessment = new _assessment2.default();
    _database2.default.query(assessment.createAssessmentQuery(assessment_name, assessment_type, job_assigned_to, description, timer, user_id), (err, data) => {

        if (err) {
            _log4js2.default.error(err);
        } else {
            res.status(200).json({
                message: "Assessment added.",
                assessmentId: data.insertId
            });
        }
    });
});

router.get("/get-create-assessment-params", (req, res, next) => {

    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    _database2.default.query(_job2.default.getAllPostedJobsToBeAssigned(user_id), (err, data) => {
        if (!err) {
            let allJobs = data;

            for (let i = 0; i < allJobs.length; i++) {
                allJobs[i].value = allJobs[i].value.toString();
            }

            _database2.default.query(_assessment2.default.getAllAssessmentTypes(), (err, data) => {
                if (!err) {
                    let allAssessmentTypes = data;

                    res.status(200).json({
                        message: "All Params",
                        assessment_types: allAssessmentTypes,
                        jobs: allJobs
                    });
                }
            });
        }
    });
});

router.post("/get-edit-assessment-params", (req, res, next) => {
    let assessment_id = req.body.assessment_id;
    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    _database2.default.query(_job2.default.getAllPostedJobsToBeAssigned(user_id), (err, data) => {
        if (!err) {
            let allJobs = data;

            for (let i = 0; i < allJobs.length; i++) {
                allJobs[i].value = allJobs[i].value.toString();
            }

            _database2.default.query(_assessment2.default.getAllAssessmentTypes(), (err, data) => {
                if (!err) {
                    let allAssessmentTypes = data;

                    _database2.default.query(_assessment2.default.getAllAssessmentQuestions(assessment_id), (err, data) => {
                        if (!err) {
                            let allQuestions = data;

                            res.status(200).json({
                                message: "All Params",
                                assessment_types: allAssessmentTypes,
                                jobs: allJobs,
                                questions: allQuestions
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get("/get-all-recruiters-assessments", (req, res, next) => {
    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    _database2.default.query(_assessment2.default.getAllAssessmentsByRecruiter(user_id), (err, data) => {
        if (!err) {
            for (let i = 0; i < data.length; i++) {
                data[i].date_time_ago = _helpers2.default.getCurrentTimeAgo(data[i].date_created);
            }

            res.status(200).json({
                message: "All Assessments",
                assessments: data
            });
        }
    });
});

router.post("/create-questions", (req, res, next) => {
    //read user information from request
    let assessment_id = req.body.assessment_id;
    let question_set = JSON.parse(req.body.question_set);

    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let assessment = new _assessment2.default();

    for (let i = 0; i < question_set.length; i++) {
        let question_no = question_set[i].index;
        let question = question_set[i].question;
        let question_type = question_set[i].question_type;
        let correct_answer = question_set[i].correct_answer;
        let score = question_set[i].score;
        let time_to_answer = question_set[i].time;

        let options = question_set[i].options;
        let option_a = options[0];
        let option_b = options[1];
        let option_c = options[2];
        let option_d = options[3];

        _database2.default.query(assessment.createQuestion(assessment_id, question_no, question, question_type, option_a, option_b, option_c, option_d, correct_answer, score, time_to_answer, user_id), (err, data) => {
            if (err) {
                _log4js2.default.error(err);
            }
        });
    }

    res.status(200).json({
        message: "Questions added."
    });
});

router.post("/edit-questions", (req, res, next) => {
    //read user information from request
    let assessment_id = req.body.assessment_id;
    let question_set = JSON.parse(req.body.question_set);

    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let assessment = new _assessment2.default();

    var ifCompleted = false;

    for (let i = 0; i < question_set.length; i++) {
        let question_id = question_set[i].question_id;
        let question_no = question_set[i].index;
        let question = question_set[i].question;
        let question_type = question_set[i].question_type;
        let correct_answer = question_set[i].correct_answer;
        let score = question_set[i].score;
        let time_to_answer = question_set[i].time;

        let options = question_set[i].options;
        let option_a = options[0];
        let option_b = options[1];
        let option_c = options[2];
        let option_d = options[3];

        //If a new question has been added, create new question; else edit
        if (typeof question_id == 'undefined') {
            _database2.default.query(assessment.createQuestion(assessment_id, question_no, question, question_type, option_a, option_b, option_c, option_d, correct_answer, score, time_to_answer, user_id), (err, data) => {
                if (!err) {
                    ifCompleted = true;
                }
            });
        } else {
            _database2.default.query(assessment.editQuestion(question_id, question_no, question, question_type, option_a, option_b, option_c, option_d, correct_answer, score, time_to_answer), (err, data) => {
                if (!err) {
                    ifCompleted = true;
                }
            });
        }
        _log4js2.default.log('ifCompleted - ' + ifCompleted);
    }

    res.status(200).json({
        message: "Questions saved successfully.",
        result: true
    });

    //logger.log('ifCompleted (AFTER)- ' +ifCompleted)
});

router.post("/edit-assessment-data", (req, res, next) => {
    //read user information from request

    let assessment_id = req.body.assessment_id;
    let assessment_name = req.body.assessment_name;
    let assessment_type = req.body.assessment_type;
    let job_assigned_to = req.body.job_assigned_to;
    let description = req.body.assessment_description;
    let timer = req.body.assessment_time;

    let assessment = new _assessment2.default();
    _database2.default.query(assessment.editAssessmentQuery(assessment_id, assessment_name, assessment_type, job_assigned_to, description, timer), (err, data) => {

        if (data) {
            res.status(200).json({
                message: "Assessment edited.",
                result: true
            });
        }
    });
});

router.get('/assessment-detail/:assessmentId', function (req, res) {
    let assessment_id = req.params.assessmentId;
    let userData = req.session.passport.user;

    let assessment = new _assessment2.default();
    _database2.default.query(assessment.getAssessmentByAssessmentId(assessment_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            let assessmentData = data[0];

            res.render('recruiter_view_assessment', {
                view: 'assessments',
                data: userData,
                assessmentData: assessmentData
            });
        }
    });
});

router.post('/get-all-assessment-candidates', function (req, res) {
    let assessment_id = req.body.assessment_id;
    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let assessment = new _assessment2.default();
    _database2.default.query(assessment.getAllAssessmentCandidates(assessment_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            let allAssessmentCandidates = data;

            let total_score = 0;

            for (let i = 0; i < allAssessmentCandidates.length; i++) {
                data[i].date_attempted = _helpers2.default.formatDateTime(data[i].date_created);

                total_score += parseInt(data[i].score);
            }

            let average_score = total_score / allAssessmentCandidates.length;
            average_score = Math.round(average_score * 10) / 10; //Round up to 1 decimal place
            _log4js2.default.log('average_score - ' + average_score);

            res.status(200).json({
                message: "All Assessment Candidates",
                candidates: allAssessmentCandidates,
                average_score: average_score
            });
        }
    });
});

router.get('/edit-assessment/:assessmentId', function (req, res) {
    let assessmentId = req.params.assessmentId;
    let userData = req.session.passport.user;

    let assessment = new _assessment2.default();
    _database2.default.query(assessment.getAssessmentByAssessmentId(assessmentId), (err, data) => {
        if (!err) {
            let assessmentData = data[0];

            res.render('recruiter_edit_assessment', {
                view: 'assessments',
                data: userData,
                assessmentData: assessmentData
            });
        }
    });
});

router.post("/delete-assessment", (req, res, next) => {
    let assessment_id = req.body.assessment_id;
    let assessment_name = req.body.assessment_name;

    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    _database2.default.query(_assessment2.default.deleteAssessmentByIdQuery(assessment_id), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {

                _helpers2.default.saveActivityTrail(user_id, "Assessment Deleted", "You have deleted your assessment.");

                res.status(200).json({
                    message: 'Assessment deleted.',
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message: "Assessment Not found."
                });
            }
        }
    });
});

router.get('/take-assessment/:assessmentToken', function (req, res) {
    let assessmentToken = req.params.assessmentToken;

    let assessment = new _assessment2.default();
    _database2.default.query(assessment.getAssessmentInfoByToken(assessmentToken), (err, data) => {
        if (err) {
            _log4js2.default.error(err);
        } else {
            let assessmentData = data[0];

            res.redirect('/assessments/assessment-info/' + assessmentData.assessment_id);
        }
    });
});

router.get('/assessment-info/:assessmentId', function (req, res) {
    let assessmentId = req.params.assessmentId;

    let assessment = new _assessment2.default();
    _database2.default.query(assessment.getAssessmentByAssessmentId(assessmentId), (err, data) => {
        if (err) {
            _log4js2.default.error(err);
        } else {
            let assessmentData = data[0];

            res.render('assessment_info_page', {
                assessmentData: assessmentData
            });
        }
    });
});

router.get('/start-test/:assessmentToken', function (req, res) {
    let assessmentToken = req.params.assessmentToken;

    if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
        let userData = req.session.passport.user;

        let assessment = new _assessment2.default();
        _database2.default.query(assessment.getAssessmentInfoByToken(assessmentToken), (err, data) => {
            if (err) {
                _log4js2.default.error(err);
            } else {
                let assessmentData = data[0];

                res.render('assessment_question_page', {
                    userData: userData,
                    assessmentData: assessmentData
                });
            }
        });
    } else {
        res.redirect('/login?f=start_test&t=' + assessmentToken);
    }
});

router.post("/get-assessment-questions", (req, res, next) => {
    let assessment_id = req.body.assessment_id;

    _database2.default.query(_assessment2.default.getAllAssessmentQuestions(assessment_id), (err, data) => {
        if (err) {
            _log4js2.default.error(err);
        } else {
            let questionsData = data;

            res.status(200).json({
                message: "All Questions",
                questionsData: questionsData
            });
        }
    });
});

module.exports = router;