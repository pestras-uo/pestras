import { EntityAccess } from "@pestras/shared/data-model";

/* eslint-disable @typescript-eslint/no-namespace */
const basePath = '/access';

export namespace EntityAccessApi {
  
  // GET
  export namespace GetByEntity {
    export const path = basePath + '/:entity';

    export interface Params { entity: string; }

    export type Response = EntityAccess;
  }
  
  // PUT
  export namespace AllowGuests {
    export const path = basePath + '/:entity/guests';

    export interface Params { entity: string; }

    export interface Body { allow: boolean; }

    export type Response = EntityAccess;
  }
  
  // POST
  export namespace AddOrgunit {
    export const path = basePath + '/:entity/orgunits/:orgunit';

    export interface Params { entity: string; orgunit: string; }

    export type Response = boolean;
  }
  // DELETE
  export namespace RemoveOrgunit {
    export const path = basePath + '/:entity/orgunits/:orgunit';

    export interface Params { entity: string; orgunit: string; }

    export type Response = boolean;
  }

  // POST
  export namespace AddUser {
    export const path = basePath + '/:entity/users/:user';

    export interface Params { entity: string; user: string; }

    export type Response = boolean;
  }
  // DELETE
  export namespace RemoveUser {
    export const path = basePath + '/:entity/users/:user';

    export interface Params { entity: string; user: string; }

    export type Response = boolean;
  }

  // POST
  export namespace AddGroup {
    export const path = basePath + '/:entity/groups/:group';

    export interface Params { entity: string; group: string; }

    export type Response = boolean;
  }
  // DELETE
  export namespace RemoveGroup {
    export const path = basePath + '/:entity/groups/:group';

    export interface Params { entity: string; group: string; }

    export type Response = boolean;
  }
}