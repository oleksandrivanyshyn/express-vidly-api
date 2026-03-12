import express from 'express';
import genres from './routes/genres.js';
import mongoose from 'mongoose';
import customers from './routes/customers.js';
import movies from './routes/movies.js';
import rentals from './routes/rentals.js';
import auth from './routes/auth.js';
import users from './routes/users.js';
import errorMiddleware from './middlewares/error.js';
import configureLogging from './startup/logging.js';
const app = express();

configureLogging();

mongoose
  .connect('mongodb://127.0.0.1:27017/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(errorMiddleware);

export default app;
