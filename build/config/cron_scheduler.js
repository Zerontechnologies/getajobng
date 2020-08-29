'use strict';

var _nodeCron = require('node-cron');

var _nodeCron2 = _interopRequireDefault(_nodeCron);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let cronScheduler = {

    scheduleAllJobs: function () {
        this.scheduleShortlistJob();
    },

    scheduleShortlistJob: function () {
        _nodeCron2.default.schedule('0 20 * * *', () => {
            console.log('running a task every minute');
        });
    }

};

module.exports = cronScheduler;