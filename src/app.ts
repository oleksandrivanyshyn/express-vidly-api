import express from 'express';
import configureLogging from './startup/logging.js';
import configureConfig from './startup/config.js';
import configureDb from './startup/db.js';
import configureRoutes from './startup/routes.js';
const app = express();

configureLogging();
configureConfig();
configureDb();
configureRoutes(app);

export default app;
