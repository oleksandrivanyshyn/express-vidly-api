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

  // 4. Логування в MongoDB (Закоментовано для продакшену)
  /*
  winston.add(
    new winston.transports.MongoDB({
      db: process.env.DB_URI || 'mongodb://127.0.0.1:27017/vidly',
      level: 'error',
      options: { useUnifiedTopology: true }
    }),
  );
  */

  if (process.env.NODE_ENV !== 'production') {
    winston.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
      }),
    );
  }
}
