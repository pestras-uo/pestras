import express from 'express';
import config from './config';
import { db } from "@pestras/backend/util";
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import { reqHandler } from './req-handler';

(async () => {

  await db.connect(config);

  const app = express();
  const server = http.createServer(app);

  app.get('/health', (_, res) => res.send('OK'));

  // security
  app.use(cors({ credentials: true, origin: "*" }));
  app.use(helmet({ crossOriginResourcePolicy: false }));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get('/clients-api/:serial/:datastore', reqHandler);

  server.listen(config.port, () => { console.log('listening on port', config.port) });

})();