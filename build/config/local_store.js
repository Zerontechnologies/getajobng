'use strict';

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _log4js = require('./log4js');

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');

let localStore = {

    saveUsersRecommendedJobsByQualification: function (jobs) {
        localStorage.setItem(_config2.default.tag_job_recommendation_by_qualification, jobs);

        _log4js2.default.log("Recommended Jobs By Qualification Saved!");

        // let allJobs = this.getUsersRecommendedJobs(); 

        /* if(allJobs.length == 0){
             logger.log("allJobs is 0")
             localStorage.setItem('recommendedJobs', jobs);
         } else{
             logger.log("allJobs IS NOT 0")
             localStorage.setItem('recommendedJobs', (allJobs +jobs));
         } */
    },

    getUsersRecommendedJobsByQualification: function () {

        let allJobs = localStorage.getItem(_config2.default.tag_job_recommendation_by_qualification);

        _log4js2.default.log("allJobs - " + allJobs);

        //let allJobsArray = helpers.parseJSONToArray(allJobs);


        //logger.log("allJobs - " + allJobs.length)
        //logger.log(allJobsArray)

        return allJobs;
    },

    saveUsersRecommendedJobsByGender: function (jobs) {
        localStorage.setItem(_config2.default.tag_job_recommendation_by_gender, jobs);

        _log4js2.default.log("Recommended Jobs By Gender Saved!");
    },

    clearLocalStore: function () {
        if (typeof localStorage === "undefined" || localStorage === null) {
            var LocalStorage = require('node-localstorage').LocalStorage;
            var localStorage = new LocalStorage('./scratch');
        }

        localStorage.clear();
    }

};

module.exports = localStore;