/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response } from "express";
import { UserSession } from "../../auth";
import { Category } from "@pestras/shared/data-model";
import { CreateCategoryInput, UpdateCategoryInput } from "@pestras/backend/models";


export namespace CategoriesApi {

  export type GetByParentReq = Request<{ serial: string; }>;
  export type GetByParentRes = Response<Category[], UserSession>;

  export type GetByValueReq = Request<{ parent: string; value: string }>;
  export type GetByValueRes = Response<Category, UserSession>;

  export type GetByIdReq = Request<{ serial: string }>;
  export type GetByIdRes = Response<Category | null, UserSession>;

  export type GetByBlueprintReq = Request<{ bp: string }>;
  export type GetByBlueprintRes = Response<Category[], UserSession>;

  export type CreateReq = Request<any, any, CreateCategoryInput>;
  export type CreateRes = Response<Category | null, UserSession>;

  export type UpdateReq = Request<{ serial: string }, any, UpdateCategoryInput>;
  export type UpdateRes = Response<Date, UserSession>;

  export type DeleteReq = Request<{ serial: string }>;
  export type DeleteRes = Response<boolean, UserSession>;
}