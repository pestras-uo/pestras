/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { UserSession } from "../../auth";
import { blueprintsModel } from "@pestras/backend/models";
import { Blueprint } from "@pestras/shared/data-model";

export function checkOwner(withCollaborators = false) {

  return async (req: Request, res: Response<any, UserSession>, next: NextFunction) => {
    const session = res.locals.issuer;
    const projection: Partial<Record<keyof Blueprint, 1 | 0>> = { owner: 1 };

    if (withCollaborators)
      projection['collaborators'] = 1;

    const bp = await blueprintsModel.getBySerial(req.params.serial, projection);

    if (!bp)
      throw new HttpError(HttpCode.NOT_FOUND, 'blueprintNotFound');

    if (bp.owner === session.serial || (withCollaborators && bp.collaborators.includes(session.serial)))
      return next();

    next(new HttpError(HttpCode.UNAUTHORIZED, 'unauthorized'));
  }
}