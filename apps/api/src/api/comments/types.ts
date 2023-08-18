/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { Comment } from "@pestras/shared/data-model";
import { Request, Response } from "express";
import { UserSession } from "../../auth";

export namespace CommentsApi {

  export type GetReq = Request<{ recordSerial: string }, any, any, { skip: string, limit: string }>;
  export type GetRes = Response<Comment[], UserSession>
  
  export type CreateReq = Request<{ recordSerial: string }, any, { text: string }>;
  export type CreateRes = Response<Comment, UserSession>
  
  export type UpdateReq = Request<{ serial: string }, any, { text: string }>;
  export type UpdateRes = Response<Date, UserSession>
  
  export type DeleteReq = Request<{ serial: string }>;
  export type DeleteRes = Response<boolean, UserSession>
  
}