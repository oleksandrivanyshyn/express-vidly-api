import express from 'express';
import genres from './routes/genres.js';

const app = express();
app.use(express.json());
app.use('api/genres', genres);

export default app;
