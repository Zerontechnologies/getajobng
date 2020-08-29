'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _log4js = require('./log4js');

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let sessionStore = {

    saveItem: function (req, key, value) {
        _log4js2.default.log(req.session[key]);
        req.session[key] = value;
    },

    getItem: function (req, key) {
        return req.session[key];
    },

    saveCandidateData: function (req, user_id, user_uuid, first_name, last_name, email, phone_number, user_role, is_logged_in, is_activated, resume_id, is_first_login, gender, tagline, address, profile_picture) {
        'use strict';

        this.saveItem(req, _config2.default.tag_user_id, user_id);
        this.saveItem(req, _config2.default.tag_user_uuid, user_uuid);
        this.saveItem(req, _config2.default.tag_first_name, first_name);
        this.saveItem(req, _config2.default.tag_last_name, last_name);
        this.saveItem(req, _config2.default.tag_email, email);
        this.saveItem(req, _config2.default.tag_phone_number, phone_number);
        this.saveItem(req, _config2.default.tag_user_role, user_role);
        this.saveItem(req, _config2.default.tag_is_logged_in, is_logged_in);
        this.saveItem(req, _config2.default.tag_is_activated, is_activated);
        this.saveItem(req, _config2.default.tag_resume_id, resume_id);
        this.saveItem(req, _config2.default.tag_is_first_login, is_first_login);
        this.saveItem(req, _config2.default.tag_gender, gender);
        this.saveItem(req, _config2.default.tag_tagline, tagline);
        this.saveItem(req, _config2.default.tag_address, address);
        this.saveItem(req, _config2.default.tag_profile_picture_url, profile_picture);

        _log4js2.default.log("Candidate Data Saved!");
    },

    getCandidateData: function (req, sessionData) {
        'use strict';

        /*
        let user_id = this.checkifUndefined(this.getItem(req, config.tag_user_id));
        let user_uuid = this.checkifUndefined(this.getItem(req, config.tag_user_uuid));
        let first_name = this.checkifUndefined(this.getItem(req, config.tag_first_name));
        let last_name = this.checkifUndefined(this.getItem(req, config.tag_last_name));
        let email = this.checkifUndefined(this.getItem(req, config.tag_email));
        let phone_number = this.checkifUndefined(this.getItem(req, config.tag_phone_number));
        let user_role = this.checkifUndefined(this.getItem(req, config.tag_user_role));
        let is_logged_in = this.checkifUndefined(this.getItem(req, config.tag_is_logged_in));
        let is_activated = this.checkifUndefined(this.getItem(req, config.tag_is_activated));
        let resume_id = this.checkifUndefined(this.getItem(req, config.tag_resume_id));
        let is_first_login = this.checkifUndefined(this.getItem(req, config.tag_is_first_login));
        let gender = this.checkifUndefined(this.getItem(req, config.tag_gender));
        let tagline = this.checkifUndefined(this.getItem(req, config.tag_tagline));
        let address = this.checkifUndefined(this.getItem(req, config.tag_address));
        let profile_picture = this.checkifUndefined(this.getItem(req, config.tag_profile_picture_url));
        */

        _log4js2.default.log("in getting data");
        //logger.log(req.session)


        let user_id = this.checkifUndefined(sessionData.user_id);
        let user_uuid = this.checkifUndefined(sessionData.user_uuid);
        let first_name = this.checkifUndefined(sessionData.first_name);
        let last_name = this.checkifUndefined(sessionData.last_name);
        let email = this.checkifUndefined(sessionData.email);
        let phone_number = this.checkifUndefined(sessionData.phone_number);
        let user_role = this.checkifUndefined(sessionData.user_role);
        let is_logged_in = this.checkifUndefined(sessionData.is_logged_in);
        let is_activated = this.checkifUndefined(sessionData.is_activated);
        let resume_id = this.checkifUndefined(sessionData.resume_id);
        let is_first_login = this.checkifUndefined(sessionData.is_first_login);
        let gender = this.checkifUndefined(sessionData.gender);
        let tagline = this.checkifUndefined(sessionData.tagline);
        let address = this.checkifUndefined(sessionData.address);
        let profile_picture = this.checkifUndefined(sessionData.profile_picture);

        let full_name = first_name + ' ' + last_name;

        let data = {
            user_id: user_id,
            user_uuid: user_uuid,
            first_name: first_name,
            last_name: last_name,
            full_name: full_name,
            email: email,
            phone_number: phone_number,
            user_role: user_role,
            is_logged_in: is_logged_in,
            is_activated: is_activated,
            resume_id: resume_id,
            is_first_login: is_first_login,
            gender: gender,
            tagline: tagline,
            address: address,
            profile_picture: profile_picture
        };

        return data;
    },

    saveRecruiterData: function (req, user_id, user_uuid, first_name, last_name, email, phone_number, user_role, is_logged_in, company_id, company_name, is_activated, is_first_login, profile_picture) {
        'use strict';

        this.saveItem(req, _config2.default.tag_user_id, user_id);
        this.saveItem(req, _config2.default.tag_user_uuid, user_uuid);
        this.saveItem(req, _config2.default.tag_first_name, first_name);
        this.saveItem(req, _config2.default.tag_last_name, last_name);
        this.saveItem(req, _config2.default.tag_email, email);
        this.saveItem(req, _config2.default.tag_phone_number, phone_number);
        this.saveItem(req, _config2.default.tag_user_role, user_role);
        this.saveItem(req, _config2.default.tag_is_logged_in, is_logged_in);
        this.saveItem(req, _config2.default.tag_company_id, company_id);
        this.saveItem(req, _config2.default.tag_company_name, company_name);
        this.saveItem(req, _config2.default.tag_is_activated, is_activated);
        this.saveItem(req, _config2.default.tag_is_first_login, is_first_login);
        this.saveItem(req, _config2.default.tag_profile_picture_url, profile_picture);

        _log4js2.default.log("Recruiter Data Saved!");
    },

    getRecruiterData: function (req) {
        'use strict';

        let user_id = this.checkifUndefined(this.getItem(req, _config2.default.tag_user_id));
        let user_uuid = this.checkifUndefined(this.getItem(req, _config2.default.tag_user_uuid));
        let first_name = this.checkifUndefined(this.getItem(req, _config2.default.tag_first_name));
        let last_name = this.checkifUndefined(this.getItem(req, _config2.default.tag_last_name));
        let email = this.checkifUndefined(this.getItem(req, _config2.default.tag_email));
        let phone_number = this.checkifUndefined(this.getItem(req, _config2.default.tag_phone_number));
        let user_role = this.checkifUndefined(this.getItem(req, _config2.default.tag_user_role));
        let is_logged_in = this.checkifUndefined(this.getItem(req, _config2.default.tag_is_logged_in));
        let is_activated = this.checkifUndefined(this.getItem(req, _config2.default.tag_is_activated));
        let company_id = this.checkifUndefined(this.getItem(req, _config2.default.tag_company_id));
        let company_name = this.checkifUndefined(this.getItem(req, _config2.default.tag_company_name));
        let is_first_login = this.checkifUndefined(this.getItem(req, _config2.default.tag_is_first_login));
        let profile_picture = this.checkifUndefined(this.getItem(req, _config2.default.tag_profile_picture_url));

        let full_name = first_name + ' ' + last_name;

        let data = {
            user_id: user_id,
            user_uuid: user_uuid,
            first_name: first_name,
            last_name: last_name,
            full_name: full_name,
            email: email,
            phone_number: phone_number,
            user_role: user_role,
            is_logged_in: is_logged_in,
            is_activated: is_activated,
            company_id: company_id,
            company_name: company_name,
            is_first_login: is_first_login,
            profile_picture: profile_picture
        };

        return data;
    },

    saveCandidateResumeInfo: function (req, resume) {
        'use strict';

        /*
        req.session.resume_data = {
            resume_id : resume.resume_id,
            percentage_complete : resume.percentage_complete,
            resume_file_url : resume.resume_file_url,
            date_created : resume.date_created,
            profile_summary : resume.profile_summary,
            willingness_to_travel : resume.willingness_to_travel,
        }
        */

        req.session.resume_data = { resume_info: JSON.stringify(resume) };

        _log4js2.default.log("Resume Info Saved!");
    },

    getCandidateResumeInfo: function (req) {
        'use strict';

        _log4js2.default.log('req.session');
        _log4js2.default.log(req.session);

        let resumeInfoInSession = JSON.parse(req.session.resume_data);

        _log4js2.default.log(resumeInfoInSession);

        let resume_id = this.checkifUndefined(resumeInfoInSession.resume_id);
        let percentage_complete = this.checkifUndefined(resumeInfoInSession.percentage_complete);
        let resume_file_url = this.checkifUndefined(resumeInfoInSession.resume_file_url);
        let date_created = this.checkifUndefined(resumeInfoInSession.date_created);
        let profile_summary = this.checkifUndefined(resumeInfoInSession.profile_summary);
        let willingness_to_travel = this.checkifUndefined(resumeInfoInSession.willingness_to_travel);

        let resumeInfo = {
            resume_id: resume_id,
            percentage_complete: percentage_complete,
            resume_file_url: resume_file_url,
            date_created: date_created,
            profile_summary: profile_summary,
            willingness_to_travel: willingness_to_travel
        };

        return resumeInfo;
    },

    saveCandidateResumeEducation: function (req, education) {
        this.saveArrayinSession(req, _config2.default.tag_resume_education, education);
        req.session.resume_data.education = JSON.stringify(education);

        _log4js2.default.log("Resume Education Saved!");
    },

    getCandidateResumeEducation: function (req) {
        _log4js2.default.log("req.session.resume_data");
        _log4js2.default.log(req.session.resume_data);

        let educationData = JSON.parse(req.session.resume_data.education);

        _log4js2.default.log("educationData");
        _log4js2.default.log(educationData);

        return educationData;
    },

    saveCandidateResumeWE: function (req, work_experience) {
        this.saveArrayinSession(req, _config2.default.tag_resume_work_experience, work_experience);

        _log4js2.default.log("Resume W.E Saved!");
    },

    getCandidateResumeWE: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_resume_work_experience);
    },

    saveCandidateResumeSpecialization: function (req, specialization) {
        this.saveArrayinSession(req, _config2.default.tag_resume_specialization, specialization);

        _log4js2.default.log("Resume specialization Saved!");
    },

    getCandidateResumeSpecialization: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_resume_specialization);
    },

    saveCandidateResumeAssociation: function (req, association) {
        this.saveArrayinSession(req, _config2.default.tag_resume_association, association);

        _log4js2.default.log("Resume association Saved!");
    },

    getCandidateResumeAssociation: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_resume_association);
    },

    saveCandidateResumeAward: function (req, award) {
        this.saveArrayinSession(req, _config2.default.tag_resume_award, award);

        _log4js2.default.log("Resume Award Saved!");
    },

    getCandidateResumeAward: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_resume_award);
    },

    saveCandidateResumeCertification: function (req, certification) {
        this.saveArrayinSession(req, _config2.default.tag_resume_certification, certification);

        _log4js2.default.log("Resume Certification Saved!");
    },

    getCandidateResumeCertification: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_resume_certification);
    },

    saveCandidateResumeLanguage: function (req, language) {
        this.saveArrayinSession(req, _config2.default.tag_resume_language, language);

        _log4js2.default.log("Resume Language Saved!");
    },

    getCandidateResumeLanguage: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_resume_language);
    },

    saveCandidateResumeReferee: function (req, referee) {
        this.saveArrayinSession(req, _config2.default.tag_resume_referee, referee);

        _log4js2.default.log("Resume Referee Saved!");
    },

    getCandidateResumeReferee: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_resume_referee);
    },

    saveCandidateResumeProject: function (req, project) {
        this.saveArrayinSession(req, _config2.default.tag_resume_project, project);

        _log4js2.default.log("Resume Project Saved!");
    },

    getCandidateResumeProject: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_resume_project);
    },

    saveCandidateResumeSkill: function (req, skill) {
        this.saveArrayinSession(req, _config2.default.tag_resume_skill, skill);

        _log4js2.default.log("Resume Skill Saved!");
    },

    getCandidateResumeSkill: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_resume_skill);
    },

    saveUsersRecommendedJobs: function (req, jobs) {
        this.saveArrayinSession(req, _config2.default.tag_jobs, jobs);

        _log4js2.default.log("Recommended Jobs Saved!");
    },

    getUsersRecommendedJobs: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_jobs);
    },

    saveUsersRecommendedJobsByQualification: function (req, jobs) {
        this.saveArrayinSession(req, _config2.default.tag_job_recommendation_by_qualification, jobs);

        _log4js2.default.log("Recommended Jobs By Qualification Saved!");
    },

    getUsersRecommendedJobsByQualification: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_job_recommendation_by_qualification);
    },

    saveUsersRecommendedJobsByGender: function (req, jobs) {
        this.saveArrayinSession(req, _config2.default.tag_job_recommendation_by_gender, jobs);

        _log4js2.default.log("Recommended Jobs By Gender Saved!");
    },

    getUsersRecommendedJobsByGender: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_job_recommendation_by_gender);
    },

    getAllUsersRecommendedJobs: function (req) {
        let recommendedJobsByQualification = this.getUsersRecommendedJobsByQualification(req);
        let recommendedJobByGender = this.getUsersRecommendedJobsByGender(req);

        let allUsersRecommendedJobs = recommendedJobsByQualification.concat(recommendedJobByGender);

        return this.sortRecommendedJobsArray(allUsersRecommendedJobs);
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

    saveUserId: function (req, user_id) {
        //this.saveItem(req, config.tag_user_id_session, user_id);
        req.session.user_id = user_id;
    },

    getUserId: function (req) {
        return req.session.passport.user.user_id;
        //return this.getItem(req, config.tag_user_id_session);
    },

    saveProfilePicture: function (req, profile_picture_url) {
        this.saveItem(req, _config2.default.tag_profile_picture_url, profile_picture_url);
    },

    getProfilePicture: function (req) {
        return this.getItem(req, _config2.default.tag_profile_picture_url);
    },

    saveArrayinSession: function (req, key, array) {
        'use strict';

        let stringedArr = JSON.stringify(array);
        this.saveItem(req, key, stringedArr);
    },

    getArrayFromSession: function (req, key) {
        'use strict';

        let stringedArr = this.getItem(req, key);
        return JSON.parse(stringedArr);
    },

    checkifUndefined: function (value) {
        if (typeof value === 'undefined') {
            return '';
        } else {
            return value;
        }
    },

    saveTPTaglineSearchResults: function (req, users) {
        this.saveArrayinSession(req, _config2.default.tag_tp_tagline_search_results, users);

        _log4js2.default.log("Tagline search results Saved!");
    },

    getTPTaglineSearchResults: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_tp_tagline_search_results);
    },

    saveTPWERolenameSearchResults: function (req, users) {
        this.saveArrayinSession(req, _config2.default.tag_tp_we_rolename_search_results, users);

        _log4js2.default.log("W.E Rolename search results Saved!");
    },

    getTPWERolenameSearchResults: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_tp_we_rolename_search_results);
    },

    saveTPSkillSearchResults: function (req, users) {
        this.saveArrayinSession(req, _config2.default.tag_tp_skill_name_search_results, users);

        _log4js2.default.log("Skill search results Saved!");
    },

    getTPSkillSearchResults: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_tp_skill_name_search_results);
    },

    saveTPIndustrySearchResults: function (req, users) {
        this.saveArrayinSession(req, _config2.default.tag_tp_industry_name_search_results, users);

        _log4js2.default.log("Industry search results Saved!");
    },

    getTPIndustrySearchResults: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_tp_industry_name_search_results);
    },

    saveTPCompanySearchResults: function (req, users) {
        this.saveArrayinSession(req, _config2.default.tag_tp_company_name_search_results, users);

        _log4js2.default.log("Company search results Saved!");
    },

    getTPCompanySearchResults: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_tp_company_name_search_results);
    },

    saveTPEduNameSearchResults: function (req, users) {
        this.saveArrayinSession(req, _config2.default.tag_tp_edu_name_search_results, users);

        _log4js2.default.log("School Name search results Saved!");
    },

    getTPEduNameSearchResults: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_tp_edu_name_search_results);
    },

    saveTPStateSearchResults: function (req, users) {
        this.saveArrayinSession(req, _config2.default.tag_tp_state_search_results, users);

        _log4js2.default.log("State search results Saved!");
    },

    getTPStateSearchResults: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_tp_state_search_results);
    },

    saveTPCountrySearchResults: function (req, users) {
        this.saveArrayinSession(req, _config2.default.tag_tp_country_search_results, users);

        _log4js2.default.log("Country search results Saved!");
    },

    getTPCountrySearchResults: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_tp_country_search_results);
    },

    saveTPEducationLevelSearchResults: function (req, users) {
        this.saveArrayinSession(req, _config2.default.tag_tp_education_level_search_results, users);
        _log4js2.default.log("Education Level search results Saved!");

        this.collateAllTalentsSearchResults(users);
    },

    getTPEducationLevelSearchResults: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_tp_education_level_search_results);
    },

    //Collate job title results
    collateJobTitleSearchResults: function (req) {
        let tagline_search_results = this.getTPTaglineSearchResults(req);
        let we_rolename_search_results = this.getTPWERolenameSearchResults(req);

        let allJobTitleResults = tagline_search_results.concat(we_rolename_search_results);

        //Save all Job Title Results
        this.saveAllJobTitleSearchResults(this.sortUsersArray(allJobTitleResults));
        this.collateAllTalentsSearchResults(allJobTitleResults);
    },

    saveAllJobTitleSearchResults: function (req, users) {
        this.saveArrayinSession(req, _config2.default.tag_tp_job_title_search_results, users);

        _log4js2.default.log("Job Title search results Saved!");
    },

    getAllJobTitleSearchResults: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_tp_job_title_search_results);
    },

    //Collate location results
    collateLocationSearchResults: function (req) {
        let state_search_results = this.getTPStateSearchResults(req);
        let country_search_results = this.getTPCountrySearchResults(req);

        let allLocationResults = state_search_results.concat(country_search_results);

        //Save all Location Results
        this.saveAllLocationSearchResults(this.sortUsersArray(allLocationResults));
        this.collateAllTalentsSearchResults(allLocationResults);
    },

    saveAllLocationSearchResults: function (req, users) {
        this.saveArrayinSession(req, _config2.default.tag_tp_location_search_results, users);

        _log4js2.default.log("Location search results Saved!");
    },

    getAllLocationSearchResults: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_tp_location_search_results);
    },

    //Collate keyword results
    collateKeywordSearchResults: function (req) {
        let skill_search_results = this.getTPSkillSearchResults(req);
        //let industry_search_results = this.getTPIndustrySearchResults(req);
        let company_name_search_results = this.getTPCompanySearchResults(req);
        let education_name_search_results = this.getTPEduNameSearchResults(req);

        let allKeywordResults = skill_search_results.concat(company_name_search_results, education_name_search_results);

        //Save all Keyword Results
        this.saveAllKeywordSearchResults(this.sortUsersArray(allKeywordResults));
        this.collateAllTalentsSearchResults(allKeywordResults);
    },

    saveAllKeywordSearchResults: function (req, users) {
        this.saveArrayinSession(req, _config2.default.tag_tp_keyword_search_results, users);

        _log4js2.default.log("Keyword search results Saved!");
    },

    getAllKeywordSearchResults: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_tp_keyword_search_results);
    },

    collateAllTalentsSearchResults: function (req, array) {
        let allTalentResults = this.getAllTalentSearchResults(req);
        //logger.log('allTalentResults')
        //logger.log(allTalentResults)
        // logger.log('array')
        //logger.log(array)

        if (!allTalentResults) {
            //   logger.log('allTalentResults is null..Processing ...')
            this.saveAllTalentSearchResults(req, array);
        } else {
            if (array) {
                //    logger.log('array exist..Processing ...')

                allTalentResults = allTalentResults.concat(array);

                this.saveAllTalentSearchResults(req, this.sortUsersArray(allTalentResults));
                //   logger.log('Array added to allTalentResults')
            }
        }
    },

    saveAllTalentSearchResults: function (req, users) {
        this.saveArrayinSession(req, _config2.default.tag_tp_search_results, users);

        _log4js2.default.log("Talent results Saved!");
    },

    getAllTalentSearchResults: function (req) {
        return this.getArrayFromSession(req, _config2.default.tag_tp_search_results);
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

    saveProfilePercentage: function (req, profile_completeness) {
        this.saveItem(req, _config2.default.tag_profile_completeness, profile_completeness);
    },

    getProfilePercentage: function (req) {
        return this.getItem(req, _config2.default.tag_profile_completeness);
    }

};

module.exports = sessionStore;