"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _database = require("../db/database");

var _database2 = _interopRequireDefault(_database);

var _resume = require("../models/resume");

var _resume2 = _interopRequireDefault(_resume);

var _helpers = require("../config/helpers");

var _helpers2 = _interopRequireDefault(_helpers);

var _config = require("./../config/config");

var _config2 = _interopRequireDefault(_config);

var _log4js = require("./../config/log4js");

var _log4js2 = _interopRequireDefault(_log4js);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

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

router.post('/add-summary', function (req, res) {
    let userData = req.session.passport.user;
    let user_id = userData.user_id;
    let summary = req.body.summary;

    let resume = new _resume2.default();
    _database2.default.query(resume.addResumeSummaryQuery(user_id, summary), (err, data) => {
        if (!err) {
            if (data) {
                //Summary has been updated
                //Get all resume info again
                //resume.getAllUserResumeInformation(user_id);

                _helpers2.default.saveActivityTrail(user_id, "Summary added", "You edited the summary in your resume.");

                res.redirect('/candidates/profile?q=summary&r=s');
            }
        }
    });
});

router.post("/add-resume", (req, res, next) => {
    //read user information from request
    let resume = new _resume2.default(req.body.user_id);

    _database2.default.query(resume.createResumeQuery(), (err, data) => {
        if (!err) {
            if (data) {
                let user_id = data.insertId;

                res.status(200).json({
                    message: "Resume added.",
                    resumeId: data.insertId
                });
            }
        }
    });
});

// Education
router.post("/all-education", (req, res, next) => {
    let resume_id = req.body.resume_id;

    _database2.default.query(_resume2.default.getAllEducationByResumeIdQuery(resume_id), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "All User's Education listed.",
                educations: data
            });
        }
    });
});

router.post("/add-education/:resumeId", (req, res, next) => {
    //read user information from request
    let name_of_institution = req.body.name_of_institution;
    let qualification = req.body.qualification;
    let qualification_grade = req.body.qualification_grade;
    let start_date = req.body.start_date;
    let end_date = req.body.end_date;
    let description = req.body.description;

    let resume_id = req.params.resumeId;

    let resume = new _resume2.default();

    _database2.default.query(resume.createEducationQuery(name_of_institution, qualification, qualification_grade, start_date, end_date, description), (err, data) => {
        if (!err) {
            if (data) {
                let education_id = data.insertId;

                _database2.default.query(_resume2.default.insertResumeEducationQuery(resume_id, education_id), (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            message: "Education added with ResumeEducation mapping.",
                            resumeEducationId: data.insertId
                        });
                    }
                });
            }
        }
    });
});

router.post("/update-education/:educationId", (req, res, next) => {
    let education_id = req.params.educationId;

    let name_of_institution = req.body.name_of_institution;
    let qualification = req.body.qualification;
    let qualification_grade = req.body.qualification_grade;
    let start_date = req.body.start_date;
    let end_date = req.body.end_date;
    let description = req.body.description;

    let resume = new _resume2.default();
    _database2.default.query(resume.updateEducationQuery(education_id, name_of_institution, qualification, qualification_grade, start_date, end_date, description), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {
                res.status(200).json({
                    message: `Education updated with id = ${education_id}`,
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message: "Education Not found."
                });
            }
        }
    });
});

router.post('/save-candidate-education', function (req, res, next) {
    let name_of_institution = _helpers2.default.checkifUndefined(req.body.name_of_institution);
    let qualification = _helpers2.default.checkifUndefined(req.body.qualification);
    let course_of_study = _helpers2.default.checkifUndefined(req.body.course_of_study);
    let start_month = _helpers2.default.checkifUndefined(req.body.start_month);
    let start_year = _helpers2.default.checkifUndefined(req.body.start_year);
    let end_month = _helpers2.default.checkifUndefined(req.body.end_month);
    let end_year = _helpers2.default.checkifUndefined(req.body.end_year);
    let currently_attend = _helpers2.default.checkifUndefined(req.body.currently_attend);

    let start_date = start_month + ', ' + start_year;
    let end_date = end_month + ', ' + end_year;

    //Getting user resume_id
    let user = req.session.passport.user;

    _log4js2.default.log(user);

    let resume = new _resume2.default();

    _database2.default.query(resume.createEducationQuery(name_of_institution, course_of_study, qualification, start_date, end_date, user.user_id), (err, data) => {
        if (!err) {
            if (data) {
                let education_id = data.insertId;
                let resume_id = user.resume_id;

                _database2.default.query(_resume2.default.insertResumeEducationQuery(resume_id, education_id), (err, data) => {
                    if (!err) {
                        //Education has been added
                        //Get all resume info again
                        //resume.getAllUserResumeInformation(user.user_id);

                        _helpers2.default.saveActivityTrail(user.user_id, "Education added", "You added an education from " + name_of_institution + " to your resume.");

                        res.status(200).json({
                            message: "Education added.",
                            resume_education_id: data.insertId
                        });
                    }
                });
            }
        }
    });
});

router.post('/delete-candidate-education', function (req, res, next) {

    let education_id = req.body.education_id;
    let name_of_institution = req.body.name_of_institution;

    //Getting user resume_id
    let user = req.session.passport.user;

    let resume = new _resume2.default();
    _database2.default.query(resume.deleteEducationQuery(education_id), (err, data) => {
        if (!err) {
            if (data) {
                //Education has been deleted
                //Get all resume info again
                resume.getAllUserResumeInformation(user.user_id);

                _helpers2.default.saveActivityTrail(user.user_id, "Education Deleted", "You deleted an education with " + name_of_institution + " from your resume.");

                res.status(200).json({
                    message: "Education deleted."
                });
            }
        }
    });
});

router.get("/get-all-qualification", (req, res, next) => {
    _database2.default.query(_resume2.default.getAllQualification(), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "All Qualification.",
                qualifications: data
            });
        }
    });
});

router.post('/edit-candidate-education', function (req, res, next) {
    //read user information from request
    let name_of_institution = _helpers2.default.checkifUndefined(req.body.name_of_institution);
    let course_of_study = _helpers2.default.checkifUndefined(req.body.course_of_study);
    let qualification = _helpers2.default.checkifUndefined(req.body.qualification);
    let start_month = _helpers2.default.checkifUndefined(req.body.start_month);
    let start_year = _helpers2.default.checkifUndefined(req.body.start_year);
    let end_month = _helpers2.default.checkifUndefined(req.body.end_month);
    let end_year = _helpers2.default.checkifUndefined(req.body.end_year);
    let education_id = _helpers2.default.checkifUndefined(req.body.education_id);

    let start_date = start_month + ', ' + start_year;
    let end_date = end_month + ', ' + end_year;

    //Getting user
    let user = req.session.passport.user;

    let resume = new _resume2.default();
    _database2.default.query(resume.updateEducationQuery(education_id, name_of_institution, course_of_study, qualification, start_date, end_date), (err, data) => {
        if (!err) {
            if (data) {
                //Education has been edited
                //Get all resume info again
                //resume.getAllUserResumeInformation(user.user_id);

                _helpers2.default.saveActivityTrail(user.user_id, "Education Edited", "You edited an education from " + name_of_institution + " in your resume.");

                res.status(200).json({
                    message: "Education edited."
                });
            }
        }
    });
});

// Project
router.post("/all-projects", (req, res, next) => {
    let resume_id = req.body.resume_id;

    _database2.default.query(_resume2.default.getAllProjectByResumeIdQuery(resume_id), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "All User's projects listed.",
                projects: data
            });
        }
    });
});

router.post("/add-project/:resumeId", (req, res, next) => {
    //read user information from request
    let project_title = req.body.project_title;
    let project_link = req.body.project_link;
    let project_description = req.body.project_description;

    let resume_id = req.params.resumeId;

    let resume = new _resume2.default();

    _database2.default.query(resume.createProjectQuery(project_title, project_link, project_description), (err, data) => {
        if (!err) {
            if (data) {
                let project_id = data.insertId;

                _database2.default.query(_resume2.default.insertResumeProjectQuery(resume_id, project_id), (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            message: "Project added with ResumeProject mapping.",
                            resume_project_id: data.insertId
                        });
                    }
                });
            }
        }
    });
});

router.post("/update-project/:projectId", (req, res, next) => {
    let project_id = req.params.projectId;

    let project_title = req.body.project_title;
    let project_link = req.body.project_link;
    let project_description = req.body.project_description;

    let resume = new _resume2.default();
    _database2.default.query(resume.updateProjectQuery(project_id, project_title, project_link, project_description), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {
                res.status(200).json({
                    message: `Project updated with id = ${project_id}`,
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message: "Project Not found."
                });
            }
        }
    });
});

//Award
router.post("/all-awards", (req, res, next) => {
    let resume_id = req.body.resume_id;

    _database2.default.query(_resume2.default.getAllAwardByResumeIdQuery(resume_id), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "All User's Awards listed.",
                awards: data
            });
        }
    });
});

router.post("/add-award/:resumeId", (req, res, next) => {
    //read user information from request
    let certificate_name = req.body.certificate_name;
    let offered_by = req.body.offered_by;
    let date_received = req.body.date_received;

    let resume_id = req.params.resumeId;

    let resume = new _resume2.default();

    _database2.default.query(resume.createAwardQuery(certificate_name, offered_by, date_received), (err, data) => {
        if (!err) {
            if (data) {
                let award_id = data.insertId;

                _database2.default.query(_resume2.default.insertResumeAwardQuery(resume_id, award_id), (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            message: "Award added with ResumeAward mapping.",
                            resume_award_id: data.insertId
                        });
                    }
                });
            }
        }
    });
});

router.post("/update-award/:awardId", (req, res, next) => {
    let award_id = req.params.awardId;

    let certificate_name = req.body.certificate_name;
    let offered_by = req.body.offered_by;
    let date_received = req.body.date_received;

    let resume = new _resume2.default();
    _database2.default.query(resume.updateAwardQuery(award_id, certificate_name, offered_by, date_received), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {
                res.status(200).json({
                    message: `Award updated with id = ${award_id}`,
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message: "Award Not found."
                });
            }
        }
    });
});

//Association
router.post("/all-associations", (req, res, next) => {
    let resume_id = req.body.resume_id;

    _database2.default.query(_resume2.default.getAllAssociationByResumeIdQuery(resume_id), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "All User's Associations listed.",
                associations: data
            });
        }
    });
});

router.post("/add-association/:resumeId", (req, res, next) => {
    //read user information from request
    let title = req.body.title;
    let name = req.body.name;

    let resume_id = req.params.resumeId;

    let resume = new _resume2.default();

    _database2.default.query(resume.createAssociationQuery(title, name), (err, data) => {
        if (!err) {
            if (data) {
                let association_id = data.insertId;

                _database2.default.query(_resume2.default.insertResumeAssociationQuery(resume_id, association_id), (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            message: "Association added with ResumeAssociation mapping.",
                            resume_association_id: data.insertId
                        });
                    }
                });
            }
        }
    });
});

router.post("/update-association/:associationId", (req, res, next) => {
    let association_id = req.params.associationId;

    let title = req.body.title;
    let name = req.body.name;

    let resume = new _resume2.default();
    _database2.default.query(resume.updateAssociationQuery(association_id, title, name), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {
                res.status(200).json({
                    message: `Association updated with id = ${association_id}`,
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message: "Association Not found."
                });
            }
        }
    });
});

//Certification
router.post("/all-certifiactions", (req, res, next) => {
    let resume_id = req.body.resume_id;

    _database2.default.query(_resume2.default.getAllCertificationByResumeIdQuery(resume_id), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "All User's Certification listed.",
                certifications: data
            });
        }
    });
});

router.post("/add-certification/:resumeId", (req, res, next) => {
    //read user information from request
    let certification_name = req.body.certification_name;
    let certification_description = req.body.certification_description;

    let resume_id = req.params.resumeId;

    let resume = new _resume2.default();

    _database2.default.query(resume.createCertificationQuery(certification_name, certification_description), (err, data) => {
        if (!err) {
            if (data) {
                let certification_id = data.insertId;

                _database2.default.query(_resume2.default.insertResumeCertificationQuery(resume_id, certification_id), (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            message: "Certification added with ResumeCertification mapping.",
                            resume_certification_id: data.insertId
                        });
                    }
                });
            }
        }
    });
});

router.post("/update-certification/:certificationId", (req, res, next) => {
    let certification_id = req.params.certificationId;

    let certification_name = req.body.certification_name;
    let certification_description = req.body.certification_description;

    let resume = new _resume2.default();
    _database2.default.query(resume.updateCertificationQuery(certification_id, certification_name, certification_description), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {
                res.status(200).json({
                    message: `Certification updated with id = ${certification_id}`,
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message: "Certification Not found."
                });
            }
        }
    });
});

router.post('/save-candidate-certification', function (req, res, next) {
    //read user information from request
    let certification_name = _helpers2.default.checkifUndefined(req.body.certification_name);
    let certification_description = _helpers2.default.checkifUndefined(req.body.certification_description);
    let month = _helpers2.default.checkifUndefined(req.body.date_obtained_month);
    let year = _helpers2.default.checkifUndefined(req.body.date_obtained_year);

    let date_obtained = month + ', ' + year;

    //Getting user resume_id
    let user = req.session.passport.user;

    let resume = new _resume2.default();
    _database2.default.query(resume.createCertificationQuery(certification_name, certification_description, date_obtained), (err, data) => {
        if (!err) {
            if (data) {
                let certification_id = data.insertId;
                let resume_id = user.resume_id;

                _database2.default.query(_resume2.default.insertResumeCertificationQuery(resume_id, certification_id), (err, data) => {
                    if (!err) {
                        _helpers2.default.saveActivityTrail(user.user_id, "Certification Added", "You added a certification to your resume.");

                        res.status(200).json({
                            message: "Certification added with ResumeCertification mapping.",
                            resume_certification_id: data.insertId
                        });
                    }
                });
            }
        }
    });
});

router.post('/delete-candidate-certification', function (req, res, next) {

    let certification_id = req.body.certification_id;

    //Getting user resume_id
    let user = req.session.passport.user;

    let resume = new _resume2.default();
    _database2.default.query(resume.deleteCertificationQuery(certification_id), (err, data) => {
        if (!err) {
            if (data) {
                _helpers2.default.saveActivityTrail(user.user_id, "Certification Deleted", "You deleted a certification from your resume.");

                res.status(200).json({
                    message: "Certification deleted."
                });
            }
        }
    });
});

router.post('/edit-candidate-certification', function (req, res, next) {
    //read user information from request
    let certification_id = _helpers2.default.checkifUndefined(req.body.certification_id);
    let certification_name = _helpers2.default.checkifUndefined(req.body.certification_name);
    let certification_description = _helpers2.default.checkifUndefined(req.body.certification_description);
    let month = _helpers2.default.checkifUndefined(req.body.date_obtained_month);
    let year = _helpers2.default.checkifUndefined(req.body.date_obtained_year);

    let date_obtained = month + ', ' + year;

    //Getting user
    let user = req.session.passport.user;

    let resume = new _resume2.default();
    _database2.default.query(resume.updateCertificationQuery(certification_id, certification_name, certification_description, date_obtained), (err, data) => {
        if (!err) {
            if (data) {
                _helpers2.default.saveActivityTrail(user.user_id, "Certification Edited", "You edited a certification in your resume.");

                res.status(200).json({
                    message: "Certification edited."
                });
            }
        }
    });
});

//Work Experience
router.post("/all-experiences", (req, res, next) => {
    let resume_id = req.body.resume_id;

    _database2.default.query(_resume2.default.getAllWorkExperienceByResumeIdQuery(resume_id), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "All User's Work Experience listed.",
                experiences: data
            });
        }
    });
});

router.post("/add-experience/:resumeId", (req, res, next) => {
    //read user information from request
    let job_title = req.body.job_title;
    let employer_name = req.body.employer_name;
    let employer_address = req.body.employer_address;
    let monthly_salary = req.body.monthly_salary;
    let job_type = req.body.job_type;
    let job_level = req.body.job_level;
    let start_date = req.body.start_date;
    let end_date = req.body.end_date;

    let resume_id = req.params.resumeId;

    let resume = new _resume2.default();

    _database2.default.query(resume.createWorkExperienceQuery(job_title, employer_name, employer_address, monthly_salary, job_type, job_level, start_date, end_date, job_responsibility), (err, data) => {
        if (!err) {
            if (data) {
                let experience_id = data.insertId;

                _database2.default.query(_resume2.default.insertResumeWorkExperienceQuery(resume_id, experience_id), (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            message: "Experience added with ResumeW.E mapping.",
                            resume_experience_id: data.insertId
                        });
                    }
                });
            }
        }
    });
});

router.post("/update-experience/:experienceId", (req, res, next) => {
    let experience_id = req.params.experienceId;

    let job_title = req.body.job_title;
    let employer_name = req.body.employer_name;
    let employer_address = req.body.employer_address;
    let monthly_salary = req.body.monthly_salary;
    let job_type = req.body.job_type;
    let job_level = req.body.job_level;
    let start_date = req.body.start_date;
    let end_date = req.body.end_date;

    let resume = new _resume2.default();
    _database2.default.query(resume.updateWorkExperienceQuery(experience_id, job_title, employer_name, employer_address, monthly_salary, job_type, job_level, start_date, end_date, job_responsibility), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {
                res.status(200).json({
                    message: `Experience updated with id = ${experience_id}`,
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message: "Experience Not found."
                });
            }
        }
    });
});

router.post('/save-candidate-experience', function (req, res, next) {
    //read user information from request
    let company_name = _helpers2.default.checkifUndefined(req.body.company_name);
    let job_title = _helpers2.default.checkifUndefined(req.body.job_title);
    let state = _helpers2.default.checkifUndefined(req.body.state);
    let country = _helpers2.default.checkifUndefined(req.body.country);
    let start_month = _helpers2.default.checkifUndefined(req.body.start_month);
    let start_year = _helpers2.default.checkifUndefined(req.body.start_year);
    let end_month = _helpers2.default.checkifUndefined(req.body.end_month);
    let end_year = _helpers2.default.checkifUndefined(req.body.end_year);
    let job_description = _helpers2.default.checkifUndefined(req.body.job_description);

    let employer_address = state + ', ' + country;
    let start_date = start_month + ', ' + start_year;
    let end_date = end_month + ', ' + end_year;

    //Getting user resume_id
    let user = req.session.passport.user;

    let resume = new _resume2.default();

    _database2.default.query(resume.createWorkExperienceQuery(job_title, company_name, employer_address, start_date, end_date, job_description, user.user_id), (err, data) => {
        if (!err) {
            if (data) {
                let experience_id = data.insertId;
                let resume_id = user.resume_id;

                _database2.default.query(_resume2.default.insertResumeWorkExperienceQuery(resume_id, experience_id), (err, data) => {
                    if (!err) {
                        //Experience has been added
                        //Get all resume info again
                        //resume.getAllUserResumeInformation(user.user_id);

                        _helpers2.default.saveActivityTrail(user.user_id, "Experience added", "You added an experience from " + company_name + " to your resume.");

                        res.status(200).json({
                            message: "Experience added with ResumeW.E mapping.",
                            resume_experience_id: data.insertId
                        });
                    }
                });
            }
        }
    });
});

router.post('/delete-candidate-experience', function (req, res, next) {

    let experience_id = req.body.experience_id;
    let company_name = req.body.company_name;

    //Getting user resume_id
    let user = req.session.passport.user;

    let resume = new _resume2.default();
    _database2.default.query(resume.deleteWorkExperienceQuery(experience_id), (err, data) => {
        if (!err) {
            if (data) {
                //Experience has been deleted
                //Get all resume info again
                //resume.getAllUserResumeInformation(user.user_id);

                _helpers2.default.saveActivityTrail(user.user_id, "Experience Deleted", "You deleted an experience with " + company_name + " from your resume.");

                res.status(200).json({
                    message: "Experience deleted."
                });
            }
        }
    });
});

router.post('/edit-candidate-experience', function (req, res, next) {
    //read user information from request
    let company_name = _helpers2.default.checkifUndefined(req.body.company_name);
    let job_title = _helpers2.default.checkifUndefined(req.body.job_title);
    let state = _helpers2.default.checkifUndefined(req.body.state);
    let country = _helpers2.default.checkifUndefined(req.body.country);
    let start_month = _helpers2.default.checkifUndefined(req.body.start_month);
    let start_year = _helpers2.default.checkifUndefined(req.body.start_year);
    let end_month = _helpers2.default.checkifUndefined(req.body.end_month);
    let end_year = _helpers2.default.checkifUndefined(req.body.end_year);
    let job_description = _helpers2.default.checkifUndefined(req.body.job_description);
    let experience_id = _helpers2.default.checkifUndefined(req.body.experience_id);

    let employer_address = state + ', ' + country;
    let start_date = start_month + ', ' + start_year;
    let end_date = end_month + ', ' + end_year;

    //Getting user
    let user = req.session.passport.user;

    let resume = new _resume2.default();
    _database2.default.query(resume.updateWorkExperienceQuery(experience_id, job_title, company_name, employer_address, start_date, end_date, job_description), (err, data) => {
        if (!err) {
            if (data) {
                //Experience has been edited
                //Get all resume info again
                //resume.getAllUserResumeInformation(user.user_id);

                _helpers2.default.saveActivityTrail(user.user_id, "Experience Edited", "You edited an experience from " + company_name + " in your resume.");

                res.status(200).json({
                    message: "Experience edited."
                });
            }
        }
    });
});

//Skill
router.post("/update-candidate-skills", (req, res, next) => {
    //read user information from request
    let skills = req.body.skills;
    let skills_array = skills.split(',');

    let userData = req.session.passport.user;
    let user_id = userData.user_id;
    let resume_id = userData.resume_id;

    //Removing all candidate skills first before adding them all again
    _database2.default.query(_resume2.default.removeAllCandidateSkillsByResumeId(resume_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            if (skills) {
                for (let i = 0; i < skills_array.length; i++) {
                    _database2.default.query(_resume2.default.insertResumeSkillQuery(resume_id, user_id, skills_array[i]), (err, data) => {
                        if (!err) {
                            if (i == skills_array.length - 1) {
                                res.status(200).json({
                                    message: "Skills added with ResumeSkills mapping.",
                                    resume_skills_id: data.insertId
                                });
                            }
                        }
                    });
                }
            } else {
                res.status(200).json({
                    message: "Skills added with ResumeSkills mapping.",
                    resume_skills_id: 0
                });
            }
        }
    });
});

//Language
router.post("/all-languages", (req, res, next) => {
    let resume_id = req.body.resume_id;

    _database2.default.query(_resume2.default.getAllLanguageByResumeIdQuery(resume_id), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "All User's Language listed.",
                languages: data
            });
        }
    });
});

router.post("/add-language/:resumeId", (req, res, next) => {
    //read user information from request
    let language = req.body.language;
    let language_level = req.body.language_level;

    let resume_id = req.params.resumeId;

    let resume = new _resume2.default();

    _database2.default.query(resume.createLanguageQuery(language, language_level), (err, data) => {
        if (!err) {
            if (data) {
                let language_id = data.insertId;

                _database2.default.query(_resume2.default.insertResumeLanguageQuery(resume_id, language_id), (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            message: "Language added with ResumeLanguage mapping.",
                            resume_language_id: data.insertId
                        });
                    }
                });
            }
        }
    });
});

router.post("/update-language/:languageId", (req, res, next) => {
    let language_id = req.params.languageId;

    let language = req.body.language;
    let language_level = req.body.language_level;

    let resume = new _resume2.default();
    _database2.default.query(resume.updateLanguageQuery(language_id, language, language_level), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {
                res.status(200).json({
                    message: `Language updated with id = ${language_id}`,
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message: "Language Not found."
                });
            }
        }
    });
});

//Specialization
router.post("/all-specializations", (req, res, next) => {
    let resume_id = req.body.resume_id;

    _database2.default.query(_resume2.default.getAllSpecializationByResumeIdQuery(resume_id), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "All User's Specialization listed.",
                specializations: data
            });
        }
    });
});

router.post("/add-specialization/:resumeId", (req, res, next) => {
    //read user information from request
    let specialization_name = req.body.specialization_name;
    let specialization_description = req.body.specialization_description;

    let resume_id = req.params.resumeId;

    let resume = new _resume2.default();

    _database2.default.query(resume.createSpecializationQuery(specialization_name, specialization_description), (err, data) => {
        if (!err) {
            if (data) {
                let specialization_id = data.insertId;

                _database2.default.query(_resume2.default.insertResumeSpecializationQuery(resume_id, specialization_id), (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            message: "Specialization added with ResumeSpecialization mapping.",
                            resume_specialization_id: data.insertId
                        });
                    }
                });
            }
        }
    });
});

router.post("/update-specialization/:specializationId", (req, res, next) => {
    let specialization_id = req.params.specializationId;

    let specialization_name = req.body.specialization_name;
    let specialization_description = req.body.specialization_description;

    let resume = new _resume2.default();
    _database2.default.query(resume.updateSpecializationQuery(specialization_id, specialization_name, specialization_description), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {
                res.status(200).json({
                    message: `Specialization updated with id = ${specialization_id}`,
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message: "Specialization Not found."
                });
            }
        }
    });
});

//Referee
router.post("/all-referees", (req, res, next) => {
    let resume_id = req.body.resume_id;

    _database2.default.query(_resume2.default.getAllRefereeByResumeIdQuery(resume_id), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "All User's Referee listed.",
                referees: data
            });
        }
    });
});

router.post("/add-referee/:resumeId", (req, res, next) => {
    //read user information from request
    let name = req.body.name;
    let phone_number = req.body.phone_number;
    let email = req.body.email;
    let relationship = req.body.relationship;
    let no_of_years = req.body.no_of_years;
    let address = req.body.address;

    let resume_id = req.params.resumeId;

    let resume = new _resume2.default();

    _database2.default.query(resume.createRefereeQuery(name, phone_number, email, relationship, no_of_years, address), (err, data) => {
        if (!err) {
            if (data) {
                let referee_id = data.insertId;

                _database2.default.query(_resume2.default.insertResumeRefereeQuery(resume_id, referee_id), (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            message: "Referee added with ResumeReferee mapping.",
                            resume_referee_id: data.insertId
                        });
                    }
                });
            }
        }
    });
});

router.post("/update-referee/:refereeId", (req, res, next) => {
    let referee_id = req.params.refereeId;

    let name = req.body.name;
    let phone_number = req.body.phone_number;
    let email = req.body.email;
    let relationship = req.body.relationship;
    let no_of_years = req.body.no_of_years;
    let address = req.body.address;

    let resume = new _resume2.default();
    _database2.default.query(resume.updateRefereeQuery(referee_id, name, phone_number, email, relationship, no_of_years, address), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {
                res.status(200).json({
                    message: `Referee updated with id = ${referee_id}`,
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message: "Referee Not found."
                });
            }
        }
    });
});

module.exports = router;