import mongoose from 'mongoose';
import winston from 'winston';

export default function configureDb() {
  let db = process.env.DB_URI || 'mongodb://127.0.0.1:27017/vidly';

  if (process.env.NODE_ENV === 'test') {
    db = 'mongodb://127.0.0.1:27017/vidly_test';
  }

  mongoose.connect(db).then(() => winston.info(`Connected to ${db}...`));
}
