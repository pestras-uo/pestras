import { EntityTypes, User, UserState } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { UsersModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export type CreateUserInput = Pick<User, 'orgunit' | 'username' | 'roles' | 'fullname' | 'email' | 'mobile' | 'is_super'>;

export async function create(
  this: UsersModel,
  data: CreateUserInput,
  hashed: string,
  issuer: string
) {
  const date = new Date();

  if (await this.usernameExists(data.username))
    throw new HttpError(HttpCode.CONFLICT, "usernameAlreadyExists");

  const user: User = {
    serial: Serial.gen("USR"),
    orgunit: data.orgunit,
    username: data.username,
    alternatives: [],
    groups: [],
    avatar: null,
    state: UserState.ACTIVE,
    roles: data.roles,
    is_super: data.is_super,
    fullname: data.fullname,
    email: data.email,
    mobile: data.mobile,
    is_guest: false,
    create_date: date,
    last_modified: date
  };

  await this.col.insertOne(user);

  this.channel.emitActivity({
    issuer,
    create_date: date,
    method: 'create',
    serial: user.serial,
    entity: EntityTypes.USER
  }, {});

  return user;
}