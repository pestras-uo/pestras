import { Role } from '@pestras/shared/data-model';
import { Router } from 'express';
import { apiAuth } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { UsersController } from './controller';
import { UserValidators } from './validators';

export const usersRoutes = Router()
  .get('/', apiAuth(), UsersController.getAll)
  .get('/:serial', apiAuth(), UsersController.getBySerial)
  .post(
    '/',
    apiAuth([Role.ADMIN]),
    validate(UserValidators.CREATE),
    UsersController.create
  )
  // username
  // --------------------------------------------------------------------------------------------------
  .put(
    '/:serial/username',
    apiAuth([Role.ADMIN]),
    validate(UserValidators.UPDATE_USERNAME),
    UsersController.updateUsername
  )
  // password
  // --------------------------------------------------------------------------------------------------
  .put(
    '/:serial/password',
    apiAuth([Role.ADMIN]),
    validate(UserValidators.UPDATE_PASSWORD),
    UsersController.updatePassword
  )
  // profile
  // --------------------------------------------------------------------------------------------------
  .put(
    '/:serial/profile',
    apiAuth([Role.ADMIN]),
    validate(UserValidators.UPDATE_PROFILE),
    UsersController.updateProfile
  )
  // roles
  // --------------------------------------------------------------------------------------------------
  .put(
    '/:serial/roles',
    apiAuth([Role.ADMIN]),
    validate(UserValidators.UPDATE_ROLE),
    UsersController.updateRoles
  )
  // groups
  // --------------------------------------------------------------------------------------------------
  .post(
    '/:serial/groups/:group',
    apiAuth([Role.ADMIN]),
    UsersController.addGroup
  )
  .delete(
    '/:serial/groups/:group',
    apiAuth([Role.ADMIN]),
    UsersController.removeGroup
  )
  // alternatives
  // --------------------------------------------------------------------------------------------------
  .post(
    '/:serial/alternatives/:alternative',
    apiAuth([Role.ADMIN]),
    UsersController.addAlternative
  )
  .delete(
    '/:serial/alternatives/:alternative',
    apiAuth([Role.ADMIN]),
    UsersController.removeAlternative
  )
  // orgunit
  // --------------------------------------------------------------------------------------------------
  .put(
    '/:serial/orgunit/:orgunit',
    apiAuth([Role.ADMIN]),
    UsersController.updateUserOrgunit
  );
