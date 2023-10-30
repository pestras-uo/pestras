/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { UserSession } from "../../auth";
import { User } from "@pestras/shared/data-model";
import { CreateUserInput, UpdateUserRolesInput } from "@pestras/backend/models";

export namespace UsersApi {

  // read
  // -------------------------------------------------------------------
  export type GetAllReq = Request;
  export type GetAllRes = Response<User[], UserSession> ;
  
  export type GetBySerialReq = Request<{ serial: string }>;
  export type GetBySerialRes = Response<User | null, UserSession>;
  
  // create
  // -------------------------------------------------------------------
  export type CreateReq = Request<any, any, CreateUserInput & { password: string; }>
  export type CreateRes = Response<User, UserSession>;
  
  // Roles
  // -------------------------------------------------------------------  
  export type UpdateRoleReq = Request<{ serial: string; }, any, UpdateUserRolesInput>;
  export type UpdateRoleRes = Response<Date, UserSession>;
  
  // Username
  // -------------------------------------------------------------------  
  export type UpdateUsernameReq = Request<{ serial: string; }, any, { username: string; }>;
  export type UpdateUsernameRes = Response<Date, UserSession>;
  
  // Password
  // -------------------------------------------------------------------  
  export type UpdatePasswordReq = Request<{ serial: string; }, any, { password: string; }>;
  export type UpdatePasswordRes = Response<boolean, UserSession>;
  
  // Profile
  // -------------------------------------------------------------------  
  export type UpdateProfileReq = Request<{ serial: string; }, any, { fullname: string; email: string; mobile: string; }>;
  export type UpdateProfileRes = Response<Date, UserSession>;
  
  // Groups
  // -------------------------------------------------------------------  
  export type AddGroupReq = Request<{ serial: string; group: string }>;
  export type AddGroupRes = Response<Date, UserSession>;
  
  export type RemoveGroupReq = Request<{ serial: string; group: string }>;
  export type RemoveGroupRes = Response<Date, UserSession>;
  
  // Alternatives
  // -------------------------------------------------------------------  
  export type AddAlternativeReq = Request<{ serial: string; alternative: string }>;
  export type AddAlternativeRes = Response<Date, UserSession>;
  
  export type RemoveAlternativeReq = Request<{ serial: string; alternative: string }>;
  export type RemoveAlternativeRes = Response<Date, UserSession>;
  
  
  // Orgunit
  // ------------------------------------------------------------------- 
  export type UpdateOrgunitReq = Request<{ serial: string; orgunit: string }>;
  export type UpdateOrgunitRes = Response<Date, UserSession>;
}