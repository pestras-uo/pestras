/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Region, RegionCoords } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";
import { CreateRegionInput, UpdateRegionInput } from "@pestras/backend/models";

export namespace RegionsApi {
  export type GetAllReq = Request;
  export type GetAllRes = Response<Region[], UserSession>;

  export type GetReq = Request<{ serial: string }>;
  export type GetRes = Response<Region | null, UserSession>;

  export type CreateReq = Request<any, any, CreateRegionInput>;
  export type CreateRes = Response<Region, UserSession>;

  export type UpdateReq = Request<{ serial: string }, any, UpdateRegionInput>;
  export type UpdateRes = Response<Date, UserSession>;

  export type UpdateCoordsReq = Request<{ serial: string }, any, RegionCoords>;
  export type UpdateCoordsRes = Response<Date, UserSession>;

}
