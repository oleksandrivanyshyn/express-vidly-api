import express from 'express';
import genres from './routes/genres.js';
import mongoose from 'mongoose';
const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use('/api/genres', genres);

export default app;
