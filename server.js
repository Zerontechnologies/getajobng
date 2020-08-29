import http from 'http';
import app from './app';
import config from './config/config';
import logger from './config/log4js';
import cronScheduler from './config/crons/cron_scheduler';

//const port = process.env.PORT || config.port;
const port = process.env.PORT;

//Create server with exported express app
const server = http.createServer(app); 
server.listen(port);

logger.log("Listening on Port: " + port);

//cronScheduler.scheduleAllJobs();