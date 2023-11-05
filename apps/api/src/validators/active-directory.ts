import { Role } from "@pestras/shared/data-model";
import { Validall } from "@pestras/validall";
import { Validators } from ".";

const passwordRegex = /^[a-zA-Z0-9!@#$%^&*-_=+.|<>:;'"()]{8,64}$/;
const usernameRegex = /^[a-zA-Z0-9_\-.]{4,64}$/;

new Validall(Validators.USERNAME, { $type: 'string', $regex: usernameRegex, $message: 'invalidUsername' });

new Validall(Validators.PASSWORD, { $type: 'string', $regex: passwordRegex, $message: 'invalidPassword' });

new Validall(Validators.FULLNAME, { $type: 'string', $message: 'invalidUsername' });

new Validall(Validators.ROLE, { $type: 'string', $in: [Role.AUTHOR, Role.DATA_ENG, Role.REPORTER, Role.VIEWER], $message: 'invalidRole' });

new Validall(Validators.FULL_ROLES, {
  $type: 'string', $in: [Role.ADMIN, Role.AUTHOR, Role.DATA_ENG, Role.REPORTER, Role.VIEWER], $message: 'invalidRole'
});

new Validall(Validators.ROLES, {
  $is: 'notEmpty', $message: 'rolesAreRequired',
  $each: { $ref: Validators.ROLE }
});