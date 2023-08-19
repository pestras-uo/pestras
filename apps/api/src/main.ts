/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
import config from './config';

// // server and plugins
import express, { NextFunction, Request, Response } from "express";
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// misc
import http from 'http';
import path from 'path';
import { HttpError, HttpCode } from "@pestras/backend/util";

// db
import { db } from '@pestras/backend/util';

// sse
import { sse } from './sse';

// init validators & models
import './validators/exports';
import './models';

// routes
import api from "./api";
// import { xsrfCheck } from './middlewares/xsrf';
import { requestLogger } from './middlewares/request-log';

(async () => {
  const app = express();
  const server = http.createServer(app);

  // ws.init(server);
  await db.connect(config);

  // logging
  app.use(requestLogger);

  // health check
  app.get('/health', (_, res) => res.send('OK'));

  // security
  app.use(cors({ credentials: true, origin: config.corsOrigin }));
  app.use(helmet({ crossOriginResourcePolicy: config.prod ? { policy: 'same-origin' } : false }));

  // static assets
  app.use('/uploads', express.static(path.join(config.uploadsDir)));
  // app.use('/assets', express.static(path.join(config.assetsDir)));

  app.use(cookieParser());
  // app.use(xsrfCheck);

  // parsers
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // routes
  app.use('/api/events', sse.router);
  app.use('/api', api);

  // error handling
  app.use((err: HttpError, _: Request, res: Response, __: NextFunction) => {
    if (!err.code || err.code >= 500) {
      console.error(err.message);
      console.trace(err);
    }

    const code = err.code && err.code > 99 && err.code < 599 ? err.code : HttpCode.UNKNOWN_ERROR;

    res.headersSent || res
      .status(code)
      .send(config.prod ? HttpCode[err.code] || "unknwonError" : err.message);
  });

  // running server
  server.listen(config.port, () => console.log('listening on port: ', config.port));

})();
