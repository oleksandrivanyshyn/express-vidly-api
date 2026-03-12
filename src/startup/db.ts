import mongoose from 'mongoose';
import winston from 'winston';

export default function configureDb() {
  const db =
    process.env.NODE_ENV === 'test'
      ? 'mongodb://127.0.0.1:27017/vidly_test'
      : 'mongodb://127.0.0.1:27017/vidly';

  mongoose.connect(db).then(() => winston.info(`Connected to ${db}...`));
}
