/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from "express";
import { UserSession } from "./auth";
import { apiAuth } from "./middlewares/auth";
import { Core } from "@pestras/backend/util";
import { Activity, Role } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';

const connected = new Map<string, Response<any, UserSession>>();

export interface ServerEventScope {
  roles?: Role[];
  orgunits?: string[];
  users?: string[];
  groups?: string[];
}

export class SSE extends Core {
  readonly router = Router()
    .get('/:t', apiAuth('t'), this.handler.bind(this));

  constructor() {
    super();

    this.channel.onServerEvent((activity, scope) => {
      for (const res of connected.values()) {
        const user = res.locals.issuer;

        if (res.locals.issuer.serial === activity.issuer)
          continue;

        if (scope.groups && scope.groups.every(g => !user.groups.includes(g)))
          continue;

        if (scope.orgunits && !scope.orgunits.every(o => !!Serial.getSharedParent(o, user.orgunit)))
          continue;

        if (scope.users && !scope.users.includes(user.serial))
          continue;

        if (scope.roles && scope.roles.every(r => !user.roles.includes(r)))
          continue;

        this.send(res, activity);
      }
    });
  }


  private handler(req: Request, res: Response<any, UserSession>) {
    connected.set(res.locals.issuer.serial, res);

    req.on('close', () => {
      console.log("sse connection closed:", res.locals.issuer.serial);
      connected.delete(res.locals.issuer.serial);
    });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream;charset=utf-8',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    });
  }

  private send(res: Response, data: Omit<Activity, 'serial'>) {
    res.write('event: activity\n');
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

export const sse = new SSE();