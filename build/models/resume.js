'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodeDatetime = require('node-datetime');

var _nodeDatetime2 = _interopRequireDefault(_nodeDatetime);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _database = require('../db/database');

var _database2 = _interopRequireDefault(_database);

var _session_store = require('../config/session_store');

var _session_store2 = _interopRequireDefault(_session_store);

var _log4js = require('./../config/log4js');

var _log4js2 = _interopRequireDefault(_log4js);

var _helpers = require('./../config/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Resume {

    constructor() {}

    createResumeQuery(user_id) {
        user_id = this.checkifUndefined(user_id);

        let date_created = this.getCurrentTimeStamp();

        let sql = `INSERT INTO resume(user_id, percentage_complete, resume_file_url, date_created, \
             profile_summary, willingness_to_travel) VALUES \
             (${user_id}, '', '', '${date_created}', '', '')`;

        return sql;
    }

    addResumeSummaryQuery(user_id, summary) {
        summary = _helpers2.default.escapeString(summary);

        let sql = `UPDATE resume SET profile_summary = '${summary}' WHERE user_id = ${user_id}`;
        return sql;
    }

    static getResumeIdByUserId(user_id) {
        let sql = `SELECT resume_id FROM resume WHERE user_id = ${user_id}`;
        return sql;
    }

    //Education
    createEducationQuery(name_of_institution, course_of_study, qualification, start_date, end_date, user_id) {

        name_of_institution = _helpers2.default.escapeString(name_of_institution);
        name_of_institution = this.checkifUndefined(name_of_institution);

        course_of_study = _helpers2.default.escapeString(course_of_study);
        course_of_study = this.checkifUndefined(course_of_study);

        qualification = this.checkifUndefined(qualification);
        start_date = this.checkifUndefined(start_date);
        end_date = this.checkifUndefined(end_date);
        user_id = this.checkifUndefined(user_id);

        let sql = `INSERT INTO education(user_id, name_of_institution, course_of_study, qualification, 
                    start_date, end_date) VALUES (${user_id}, '${name_of_institution}', '${course_of_study}', \
                    ${qualification}, '${start_date}', '${end_date}')`;

        return sql;
    }

    static insertResumeEducationQuery(resume_id, education_id) {
        let sql = `INSERT INTO resume_education(resume_id, education_id) VALUES (${resume_id}, ${education_id})`;

        return sql;
    }

    updateEducationQuery(education_id, name_of_institution, course_of_study, qualification, start_date, end_date) {

        name_of_institution = _helpers2.default.escapeString(name_of_institution);
        name_of_institution = this.checkifUndefined(name_of_institution);

        course_of_study = _helpers2.default.escapeString(course_of_study);
        course_of_study = this.checkifUndefined(course_of_study);

        qualification = this.checkifUndefined(qualification);
        start_date = this.checkifUndefined(start_date);
        end_date = this.checkifUndefined(end_date);

        let sql = `UPDATE education SET name_of_institution = '${name_of_institution}', course_of_study = '${course_of_study}', \
                    qualification = ${qualification}, start_date = '${start_date}', end_date = '${end_date}'\
                    WHERE education_id = ${education_id}`;

        return sql;
    }

    static getAllEducationByResumeIdQuery(resume_id) {
        let sql = `SELECT e.*, q.* FROM education e INNER JOIN qualification q 
                ON e.qualification = q.qualification_id WHERE e.education_id IN 
                (SELECT re.education_id FROM resume_education re WHERE re.resume_id = ${resume_id})`;

        return sql;
    }

    deleteEducationQuery(education_id) {
        let sql = `DELETE FROM education WHERE education_id = ${education_id}`;

        return sql;
    }

    //Work Experience 
    createWorkExperienceQuery(job_title, employer_name, employer_address, start_date, end_date, job_responsibility, user_id) {

        job_title = _helpers2.default.escapeString(job_title);
        job_title = this.checkifUndefined(job_title);

        employer_name = _helpers2.default.escapeString(employer_name);
        employer_name = this.checkifUndefined(employer_name);

        employer_address = _helpers2.default.escapeString(employer_address);
        employer_address = this.checkifUndefined(employer_address);

        start_date = this.checkifUndefined(start_date);
        end_date = this.checkifUndefined(end_date);

        job_responsibility = _helpers2.default.escapeString(job_responsibility);
        job_responsibility = this.checkifUndefined(job_responsibility);

        user_id = this.checkifUndefined(user_id);

        let sql = `INSERT INTO work_experience(user_id, job_title, employer_name, employer_address, \
             start_date, end_date, job_responsibility) VALUES (${user_id}, '${job_title}', '${employer_name}',\
                 '${employer_address}', '${start_date}', '${end_date}',\
                  '${job_responsibility}')`;

        return sql;
    }

    static insertResumeWorkExperienceQuery(resume_id, experience_id) {
        let sql = `INSERT INTO resume_work_experience(resume_id, experience_id) VALUES (${resume_id}, ${experience_id})`;

        return sql;
    }

    updateWorkExperienceQuery(experience_id, job_title, employer_name, employer_address, start_date, end_date, job_responsibility) {

        job_title = _helpers2.default.escapeString(job_title);
        job_title = this.checkifUndefined(job_title);

        employer_name = _helpers2.default.escapeString(employer_name);
        employer_name = this.checkifUndefined(employer_name);

        employer_address = _helpers2.default.escapeString(employer_address);
        employer_address = this.checkifUndefined(employer_address);

        start_date = this.checkifUndefined(start_date);
        end_date = this.checkifUndefined(end_date);

        job_responsibility = _helpers2.default.escapeString(job_responsibility);
        job_responsibility = this.checkifUndefined(job_responsibility);

        let sql = `UPDATE work_experience SET job_title = '${job_title}', employer_name = '${employer_name}', \
        employer_address = '${employer_address}', start_date = '${start_date}', end_date = '${end_date}',\
        job_responsibility = '${job_responsibility}' WHERE experience_id = ${experience_id}`;

        return sql;
    }

    static getAllWorkExperienceByResumeIdQuery(resume_id) {
        let sql = `SELECT * FROM work_experience WHERE experience_id IN (SELECT experience_id FROM resume_work_experience \
            WHERE resume_id = ${resume_id})`;
        return sql;
    }

    static getAllWorkExperienceByUserIdQuery(user_id) {
        let sql = `SELECT * FROM work_experience WHERE user_id = ${user_id}`;

        return sql;
    }

    deleteWorkExperienceQuery(experience_id) {
        let sql = `DELETE FROM work_experience WHERE experience_id = ${experience_id}`;

        return sql;
    }

    //Project
    createProjectQuery(project_title, project_link, project_description) {
        project_title = _helpers2.default.escapeString(project_title);
        project_title = this.checkifUndefined(project_title);

        project_link = _helpers2.default.escapeString(project_link);
        project_link = this.checkifUndefined(project_link);

        project_description = _helpers2.default.escapeString(project_description);
        project_description = this.checkifUndefined(project_description);

        let sql = `INSERT INTO project(project_title, project_link, project_description) VALUES \
        ('${project_title}', '${project_link}', '${project_description}')`;

        return sql;
    }

    static insertResumeProjectQuery(resume_id, project_id) {
        let sql = `INSERT INTO resume_project(resume_id, project_id) VALUES (${resume_id}, ${project_id})`;

        return sql;
    }

    updateProjectQuery(project_id, project_title, project_link, project_description) {
        project_title = _helpers2.default.escapeString(project_title);
        project_title = this.checkifUndefined(project_title);

        project_link = _helpers2.default.escapeString(project_link);
        project_link = this.checkifUndefined(project_link);

        project_description = _helpers2.default.escapeString(project_description);
        project_description = this.checkifUndefined(project_description);

        let sql = `UPDATE project SET project_title = '${project_title}', project_link = '${project_link}', \
        project_description = '${project_description}' WHERE project_id = ${project_id}`;

        return sql;
    }

    static getAllProjectByResumeIdQuery(resume_id) {
        let sql = `SELECT * FROM project WHERE project_id IN (SELECT project_id FROM resume_project \
            WHERE resume_id = ${resume_id})`;
        return sql;
    }

    //Certification
    createCertificationQuery(certification_name, certification_description, date_obtained) {
        certification_name = _helpers2.default.escapeString(certification_name);
        certification_name = this.checkifUndefined(certification_name);

        certification_description = _helpers2.default.escapeString(certification_description);
        certification_description = this.checkifUndefined(certification_description);

        date_obtained = this.checkifUndefined(date_obtained);

        let sql = `INSERT INTO certification(certification_name, certification_description, date_obtained) \
            VALUES ('${certification_name}', '${certification_description}', '${date_obtained}')`;

        return sql;
    }

    static insertResumeCertificationQuery(resume_id, certification_id) {
        let sql = `INSERT INTO resume_certification(resume_id, certification_id) VALUES (${resume_id}, ${certification_id})`;

        return sql;
    }

    updateCertificationQuery(certification_id, certification_name, certification_description, date_obtained) {

        certification_name = _helpers2.default.escapeString(certification_name);
        certification_name = this.checkifUndefined(certification_name);

        certification_description = _helpers2.default.escapeString(certification_description);
        certification_description = this.checkifUndefined(certification_description);

        date_obtained = this.checkifUndefined(date_obtained);

        let sql = `UPDATE certification SET certification_name = '${certification_name}', \
            certification_description = '${certification_description}', \
            date_obtained = '${date_obtained}' WHERE certification_id = ${certification_id}`;

        return sql;
    }

    static getAllCertificationByResumeIdQuery(resume_id) {
        let sql = `SELECT * FROM certification WHERE certification_id IN (SELECT certification_id \
            FROM resume_certification WHERE resume_id = ${resume_id})`;

        return sql;
    }

    deleteCertificationQuery(certification_id) {
        let sql = `DELETE FROM certification WHERE certification_id = ${certification_id}`;

        return sql;
    }

    //Association
    createAssociationQuery(title, name) {
        title = _helpers2.default.escapeString(title);
        title = this.checkifUndefined(title);

        name = _helpers2.default.escapeString(name);
        name = this.checkifUndefined(name);

        let sql = `INSERT INTO association(title, name) VALUES ('${title}', '${name}')`;

        return sql;
    }

    static insertResumeAssociationQuery(resume_id, association_id) {
        let sql = `INSERT INTO resume_association(resume_id, association_id) VALUES (${resume_id}, ${association_id})`;

        return sql;
    }

    updateAssociationQuery(association_id, title, name) {
        title = _helpers2.default.escapeString(title);
        title = this.checkifUndefined(title);

        name = _helpers2.default.escapeString(name);
        name = this.checkifUndefined(name);

        let sql = `UPDATE association SET title = '${title}', name = '${name}' WHERE association_id = ${association_id}`;

        return sql;
    }

    static getAllAssociationByResumeIdQuery(resume_id) {
        let sql = `SELECT * FROM association WHERE association_id IN (SELECT association_id \
             FROM resume_association WHERE resume_id = ${resume_id})`;
        return sql;
    }

    //Award
    createAwardQuery(certificate_name, offered_by, date_received) {
        certificate_name = _helpers2.default.escapeString(certificate_name);
        certificate_name = this.checkifUndefined(certificate_name);

        offered_by = _helpers2.default.escapeString(offered_by);
        offered_by = this.checkifUndefined(offered_by);

        date_received = this.checkifUndefined(date_received);

        let sql = `INSERT INTO award(certificate_name, offered_by, date_received) VALUES \
        ('${certificate_name}', '${offered_by}', '${date_received}')`;

        return sql;
    }

    static insertResumeAwardQuery(resume_id, award_id) {
        let sql = `INSERT INTO resume_award(resume_id, award_id) VALUES (${resume_id}, ${award_id})`;

        return sql;
    }

    updateAwardQuery(award_id, certificate_name, offered_by, date_received) {
        certificate_name = _helpers2.default.escapeString(certificate_name);
        certificate_name = this.checkifUndefined(certificate_name);

        offered_by = _helpers2.default.escapeString(offered_by);
        offered_by = this.checkifUndefined(offered_by);

        date_received = this.checkifUndefined(date_received);

        let sql = `UPDATE award SET certificate_name = '${certificate_name}', offered_by = '${offered_by}',\
        date_received = '${date_received}' WHERE award_id = ${award_id}`;

        return sql;
    }

    static getAllAwardByResumeIdQuery(resume_id) {
        let sql = `SELECT * FROM award WHERE award_id IN (SELECT award_id \
             FROM resume_award WHERE resume_id = ${resume_id})`;
        return sql;
    }

    //Language
    createLanguageQuery(language, language_level) {
        language = this.checkifUndefined(language);
        language_level = this.checkifUndefined(language_level);

        let sql = `INSERT INTO language(language, language_level) VALUES ('${language}', '${language_level}')`;

        return sql;
    }

    static insertResumeLanguageQuery(resume_id, language_id) {
        let sql = `INSERT INTO resume_language(resume_id, language_id) VALUES (${resume_id}, ${language_id})`;

        return sql;
    }

    updateLanguageQuery(language_id, language, language_level) {
        language = this.checkifUndefined(language);
        language_level = this.checkifUndefined(language_level);

        let sql = `UPDATE language SET language = '${language}', language_level = '${language_level}'\
         WHERE language_id = ${language_id}`;

        return sql;
    }

    static getAllLanguageByResumeIdQuery(resume_id) {
        let sql = `SELECT * FROM language WHERE language_id IN (SELECT language_id \
             FROM resume_language WHERE resume_id = ${resume_id})`;
        return sql;
    }

    //Referee
    createRefereeQuery(name, phone_number, email, relationship, no_of_years, address) {
        name = this.checkifUndefined(name);
        phone_number = this.checkifUndefined(phone_number);
        email = this.checkifUndefined(email);
        relationship = this.checkifUndefined(relationship);
        no_of_years = this.checkifUndefined(no_of_years);
        address = this.checkifUndefined(address);

        let sql = `INSERT INTO referee(name, phone_number, email, relationship, no_of_years, address) VALUES \
        (${name}, ${phone_number}, ${email}, ${relationship}, ${no_of_years}, ${address})`;

        return sql;
    }

    static insertResumeRefereeQuery(resume_id, referee_id) {
        let sql = `INSERT INTO resume_referee(resume_id, referee_id) VALUES (${resume_id}, ${referee_id})`;

        return sql;
    }

    updateRefereeQuery(referee_id, name, phone_number, email, relationship, no_of_years, address) {
        name = this.checkifUndefined(name);
        phone_number = this.checkifUndefined(phone_number);
        email = this.checkifUndefined(email);
        relationship = this.checkifUndefined(relationship);
        no_of_years = this.checkifUndefined(no_of_years);
        address = this.checkifUndefined(address);

        let sql = `UPDATE language SET name = '${name}', phone_number = '${phone_number}', email = '${email}',\
        relationship = '${relationship}', no_of_years = '${no_of_years}', address = '${address}' \
        WHERE referee_id = ${referee_id}`;

        return sql;
    }

    static getAllRefereeByResumeIdQuery(resume_id) {
        let sql = `SELECT * FROM referee WHERE referee_id IN (SELECT referee_id \
             FROM resume_referee WHERE resume_id = ${resume_id})`;
        return sql;
    }

    //Specialization
    createSpecializationQuery(specialization_name, specialization_description) {
        specialization_name = this.checkifUndefined(specialization_name);
        specialization_description = this.checkifUndefined(specialization_description);

        let sql = `INSERT INTO specialization (specialization_name, specialization_description) VALUES\
         (${specialization_description}, ${specialization_description})`;

        return sql;
    }

    static insertResumeSpecializationQuery(resume_id, specialization_id) {
        let sql = `INSERT INTO resume_specialization(resume_id, specialization_id) VALUES (${resume_id}, ${specialization_id})`;

        return sql;
    }

    updateSpecializationQuery(specialization_id, specialization_name, specialization_description) {
        specialization_name = this.checkifUndefined(specialization_name);
        specialization_description = this.checkifUndefined(specialization_description);

        let sql = `UPDATE specialization SET specialization_name = '${specialization_name}', \
        specialization_description = '${specialization_description}' WHERE specialization_id = ${specialization_id}`;

        return sql;
    }

    static getAllSpecializationByResumeIdQuery(resume_id) {
        let sql = `SELECT * FROM specialization WHERE specialization_id IN (SELECT specialization_id \
             FROM resume_specialization WHERE resume_id = ${resume_id})`;
        return sql;
    }

    //Skill
    createSkillQuery(skill_name) {
        skill_name = this.checkifUndefined(skill_name);

        let sql = `INSERT INTO skill (skill_name) VALUES ('${skill_name}')`;

        return sql;
    }

    static insertResumeSkillQuery(resume_id, user_id, skill_id) {
        let sql = `INSERT INTO resume_skill(resume_id, user_id, skill_id) VALUES \
            (${resume_id}, ${user_id}, ${skill_id})`;

        return sql;
    }

    updateSkillQuery(skill_id, skill_name) {
        skill_name = this.checkifUndefined(skill_name);

        let sql = `UPDATE skill SET skill_name = '${skill_name}', value = '${skill_id}' \
                WHERE skill_id = ${skill_id}`;

        return sql;
    }

    static getAllSkillByResumeIdQuery(resume_id) {
        let sql = `SELECT skill_name AS label, value FROM skill WHERE skill_id IN (SELECT skill_id \
             FROM resume_skill WHERE resume_id = ${resume_id})`;

        return sql;
    }

    static removeAllCandidateSkillsByResumeId(resume_id) {
        let sql = `DELETE FROM resume_skill WHERE resume_id = ${resume_id}`;

        return sql;
    }

    static getResumeByUserIdQuery(user_id) {
        let sql = `SELECT * FROM resume WHERE user_id = ${user_id}`;
        return sql;
    }

    static getResumeByResumeIdQuery(resume_id) {
        let sql = `SELECT * FROM resume WHERE resume_id = ${resume_id}`;
        return sql;
    }

    static deleteResumeByIdQuery(resume_id) {
        let sql = `DELETE FROM resume WHERE resume_id = ${resume_id}`;
        return sql;
    }

    getAllUserResumeInformation(req, user_id) {

        //Get all Candidate Resume info initially
        _database2.default.query(Resume.getResumeByUserIdQuery(user_id), (err, data) => {
            if (err) {
                _log4js2.default.log(err);
            } else {
                let resume = data[0];
                let resume_id = data[0].resume_id;

                _session_store2.default.saveCandidateResumeInfo(req, resume);

                _log4js2.default.log("resume - ");
                _log4js2.default.log(resume);

                //Get all Candidate Educations
                _database2.default.query(Resume.getAllEducationByResumeIdQuery(resume_id), (err, data) => {
                    if (err) {
                        _log4js2.default.log(err);
                    } else {
                        let education = data;
                        _log4js2.default.log("education - ");
                        _log4js2.default.log(education);

                        _session_store2.default.saveCandidateResumeEducation(req, education);
                    }
                });

                //Get all Candidate WEs
                _database2.default.query(Resume.getAllWorkExperienceByResumeIdQuery(resume_id), (err, data) => {
                    if (err) {
                        _log4js2.default.log(err);
                    } else {
                        let work_experience = data;
                        _log4js2.default.log("work_experience - ");
                        _log4js2.default.log(work_experience);

                        _session_store2.default.saveCandidateResumeWE(req, work_experience);
                    }
                });

                //Get all Candidate Languages
                _database2.default.query(Resume.getAllLanguageByResumeIdQuery(resume_id), (err, data) => {
                    if (err) {
                        _log4js2.default.log(err);
                    } else {
                        let language = data;
                        _log4js2.default.log("language - ");
                        _log4js2.default.log(language);

                        _session_store2.default.saveCandidateResumeLanguage(req, language);
                    }
                });

                //Get all Candidate Certifications
                _database2.default.query(Resume.getAllCertificationByResumeIdQuery(resume_id), (err, data) => {
                    if (err) {
                        _log4js2.default.log(err);
                    } else {
                        let certification = data;
                        _log4js2.default.log("certification - ");
                        _log4js2.default.log(certification);

                        _session_store2.default.saveCandidateResumeCertification(req, certification);
                    }
                });

                //Get all Candidate Associations
                _database2.default.query(Resume.getAllAssociationByResumeIdQuery(resume_id), (err, data) => {
                    if (err) {
                        _log4js2.default.log(err);
                    } else {
                        let association = data;
                        _log4js2.default.log("association - ");
                        _log4js2.default.log(association);

                        _session_store2.default.saveCandidateResumeAssociation(req, association);
                    }
                });

                //Get all Candidate Awards
                _database2.default.query(Resume.getAllAwardByResumeIdQuery(resume_id), (err, data) => {
                    if (err) {
                        _log4js2.default.log(err);
                    } else {
                        let award = data;
                        _log4js2.default.log("award - ");
                        _log4js2.default.log(award);

                        _session_store2.default.saveCandidateResumeAward(req, award);
                    }
                });

                //Get all Candidate Specializations
                _database2.default.query(Resume.getAllSpecializationByResumeIdQuery(resume_id), (err, data) => {
                    if (err) {
                        _log4js2.default.log(err);
                    } else {
                        let specialization = data;
                        _log4js2.default.log("specialization - ");
                        _log4js2.default.log(specialization);

                        _session_store2.default.saveCandidateResumeSpecialization(req, specialization);
                    }
                });

                //Get all Candidate Projects
                _database2.default.query(Resume.getAllProjectByResumeIdQuery(resume_id), (err, data) => {
                    if (err) {
                        _log4js2.default.log(err);
                    } else {
                        let project = data;
                        _log4js2.default.log("project - ");
                        _log4js2.default.log(project);

                        _session_store2.default.saveCandidateResumeProject(req, project);
                    }
                });

                //Get all Candidate Referees
                _database2.default.query(Resume.getAllRefereeByResumeIdQuery(resume_id), (err, data) => {
                    if (err) {
                        _log4js2.default.log(err);
                    } else {
                        let referee = data;
                        _log4js2.default.log("referee - ");
                        _log4js2.default.log(referee);

                        _session_store2.default.saveCandidateResumeReferee(req, referee);
                    }
                });

                //Get all Candidate Skills
                _database2.default.query(Resume.getAllSkillByResumeIdQuery(resume_id), (err, data) => {
                    if (err) {
                        _log4js2.default.log(err);
                    } else {
                        let skills = data;
                        _log4js2.default.log("skills - ");
                        _log4js2.default.log(skills);

                        _session_store2.default.saveCandidateResumeSkill(req, skills);
                    }
                });
            }
        });
    }

    static getAllQualification() {
        let sql = `SELECT * FROM qualification`;

        return sql;
    }

    checkifUndefined(value) {
        if (typeof value === 'undefined') {
            return null;
        } else {
            return value;
        }
    }

    getCurrentTimeStamp() {
        let dt = _nodeDatetime2.default.create();
        let date_created = dt.format('Y-m-d H:M:S');

        return date_created;
    }

    updateResumeQueryBuilder(resume_id, table_name) {
        var data = {
            "one": "Data1",
            "two": "Data2",
            "three": null,
            "four": "Data4"
        };

        var columns = {
            "one": "First",
            "two": "Second",
            "three": "Third",
            "four": "Four"
        };

        var query = "UPDATE " + table_name + " SET ";
        Object.keys(data).forEach(function (key) {
            if (!(data[key] === null || data[key] === "")) query += columns[key] + "='" + data[key] + "',";
        });

        query += " WHERE resume_id = " + resume_id;

        //replace last comma from query
        var n = query.lastIndexOf(",");
        query = query.slice(0, n) + query.slice(n).replace(",", "");

        _log4js2.default.log(query);
    }

}

exports.default = Resume;