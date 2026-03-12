import express from 'express';
import configureLogging from './startup/logging.js';
import configureConfig from './startup/config.js';
import configureDb from './startup/db.js';
import configureRoutes from './startup/routes.js';
const app = express();
import prod from './startup/prod.js';
configureLogging();
configureConfig();
configureDb();
configureRoutes(app);
prod(app);

export default app;
