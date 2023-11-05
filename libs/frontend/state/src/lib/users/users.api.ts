/* eslint-disable @typescript-eslint/no-namespace */
import { User, UserProfile } from "@pestras/shared/data-model";

const basePath = `/users`;

export namespace UsersApi {


  // GET
  export namespace GetAll {
    export const path = basePath + "";

    export type Response = User[];
  }



  // GET
  export namespace GetBySerial {
    export const path = basePath + "/:serial";

    export interface Params { serial: string; }

    export type Response = User | null;
  }



  // POST
  export namespace Create {
    export const path = basePath + "";

    export type Body = Pick<
      User,
      'orgunit' | 'username' | 'roles' | 'fullname' | 'email' | 'mobile' | 'is_super'
    > & { password: string }

    export type Response = User;
  }



  // PUT
  export namespace UpdateUsername {
    export const path = basePath + "/:serial/username";

    export interface Params { serial: string; }

    export interface Body { username: string; };

    export type Response = string; // date
  }


  // PUT
  export namespace UpdatePassword {
    export const path = basePath + "/:serial/password";

    export interface Params { serial: string; }

    export interface Body { password: string; };

    export type Response = boolean;
  }


  // PUT
  export namespace UpdateProfile {
    export const path = basePath + "/:serial/profile";

    export interface Params { serial: string; }

    export type Body  = UserProfile;

    export type Response = string; // date
  }


  // PUT
  export namespace UpdateRoles {
    export const path = basePath + "/:serial/roles";

    export interface Params { serial: string; }

    export type Body = Pick<User, 'roles' | 'is_super'>;

    export type Response = string; // date
  }



  // POST
  export namespace AddGroup {
    export const path = basePath + "/:serial/groups/:group";

    export interface Params { serial: string; group: string; }

    export type Response = string; // date
  }



  // DELETE
  export namespace RemoveGroup {
    export const path = basePath + "/:serial/groups/:group";

    export interface Params { serial: string; group: string; }

    export type Response = string; // date
  }



  // POST
  export namespace AddAlternative {
    export const path = basePath + "/:serial/alternatives/:alternative";

    export interface Params { serial: string; alternative: string; }

    export type Response = string; // date
  }



  // DELETE
  export namespace RemoveAlternative {
    export const path = basePath + "/:serial/alternatives/:alternative";

    export interface Params { serial: string; alternative: string; }

    export type Response = string; // date
  }
}