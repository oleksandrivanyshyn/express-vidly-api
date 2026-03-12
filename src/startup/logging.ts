import winston from 'winston';
import 'winston-mongodb';

export default function configureLogging() {
  winston.exceptions.handle(
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
  );

  winston.rejections.handle(
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
  );

  winston.add(
    new winston.transports.File({
      filename: 'logfile.log',
      level: 'error',
    }),
  );

  winston.add(
    new winston.transports.MongoDB({
      db: 'mongodb://127.0.0.1:27017/vidly',
      level: 'error',
    }),
  );

  if (process.env.NODE_ENV !== 'production') {
    winston.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    );
  }
}
