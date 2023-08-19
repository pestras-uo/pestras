/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { blueprintsModel } from "../../models";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { UserSession } from "../../auth";

export function checkOwner(withCollaborators = false) {

  return async (req: Request, res: Response<any, UserSession>, next: NextFunction) => {
    const session = res.locals.issuer
    const bp = await blueprintsModel.getBySerial(req.params.serial, { owner: 1, collaborators: +withCollaborators });

    if (!bp)
      throw new HttpError(HttpCode.NOT_FOUND, 'blueprintNotFound');

    if (bp.owner === session.serial || (withCollaborators && bp.collaborators.includes(session.serial)))
      return next();

    next(new HttpError(HttpCode.UNAUTHORIZED, 'unauthorized'));
  }
}