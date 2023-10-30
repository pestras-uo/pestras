import argon from 'argon2';
import { UsersApi } from "./types";
import { NextFunction } from 'express';
import { authModel, usersModel, workspaceModel } from '@pestras/backend/models';

export const UsersController = {

  async getAll(_: UsersApi.GetAllReq, res: UsersApi.GetAllRes, next: NextFunction) {
    try {
      res.json(await usersModel.getAll());
      
    } catch (error) {
      next(error);
    }
  },

  async getBySerial(req: UsersApi.GetBySerialReq, res: UsersApi.GetBySerialRes, next: NextFunction) {
    try {
      res.json(await usersModel.getBySerial(req.params.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async create(req: UsersApi.CreateReq, res: UsersApi.CreateRes, next: NextFunction) {
    try {
      const hashed = await argon.hash(req.body.password);
      const user = await usersModel.create(req.body, hashed, res.locals.issuer.serial);
  
      await authModel.create({ user: user.serial, password: hashed });
      await workspaceModel.create(user.serial);
  
      res.json(user);
      
    } catch (error) {
      next(error);
    }
  },

  // roles
  // --------------------------------------------------------------------------------------------------
  async updateRoles(req: UsersApi.UpdateRoleReq, res: UsersApi.UpdateRoleRes, next: NextFunction) {
    try {
      res.json(await usersModel.updateRoles(req.params.serial, req.body, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  },

  // username
  // --------------------------------------------------------------------------------------------------
  async updateUsername(req: UsersApi.UpdateUsernameReq, res: UsersApi.UpdateUsernameRes, next: NextFunction) {
    try {
      res.json(await usersModel.updateUsername(req.params.serial, req.body.username));
      
    } catch (error) {
      next(error);
    }
  },

  // profile
  // --------------------------------------------------------------------------------------------------
  async updateProfile(req: UsersApi.UpdateProfileReq, res: UsersApi.UpdateProfileRes, next: NextFunction) {
    try {
      res.json(await usersModel.updateProfile(req.params.serial, req.body.fullname, req.body.mobile, req.body.email));
      
    } catch (error) {
      next(error);
    }
  },

  // password
  // --------------------------------------------------------------------------------------------------
  async updatePassword(req: UsersApi.UpdatePasswordReq, res: UsersApi.UpdatePasswordRes, next: NextFunction) {
    try {
      const hashedPass = await argon.hash(req.body.password);

      res.json(await authModel.updatePassword(req.params.serial, hashedPass));
      
    } catch (error) {
      next(error);
    }
  },

  // groups
  // --------------------------------------------------------------------------------------------------
  async addGroup(req: UsersApi.AddGroupReq, res: UsersApi.AddGroupRes, next: NextFunction) {
    try {
      res.json(await usersModel.addGroup(req.params.serial, req.params.group, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async removeGroup(req: UsersApi.RemoveGroupReq, res: UsersApi.RemoveGroupRes, next: NextFunction) {
    try {
      res.json(await usersModel.removeGroup(req.params.serial, req.params.group, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  },

  // alternatives
  // --------------------------------------------------------------------------------------------------
  async addAlternative(req: UsersApi.AddAlternativeReq, res: UsersApi.AddAlternativeRes, next: NextFunction) {
    try {
      res.json(await usersModel.addAlternative(req.params.serial, req.params.alternative, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async removeAlternative(req: UsersApi.RemoveAlternativeReq, res: UsersApi.RemoveAlternativeRes, next: NextFunction) {
    try {
      res.json(await usersModel.removeAlternative(req.params.serial, req.params.alternative, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  },


  // orgunit
  // --------------------------------------------------------------------------------------------------
  async updateUserOrgunit(req: UsersApi.UpdateOrgunitReq, res: UsersApi.UpdateOrgunitRes, next: NextFunction) {
    try {
      res.json(await usersModel.updateOrgunit(req.params.serial, req.params.orgunit, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  }

}