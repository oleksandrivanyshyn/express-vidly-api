import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import type { Express } from 'express-serve-static-core';

function prod(app: Express) {
  app.use(helmet());
  app.use(compression());
  app.use(cors());
}
export default prod;
