/* eslint-disable @typescript-eslint/no-namespace */
import { User } from "@pestras/shared/data-model";

const sessionBasePath = `/session`;
const accountBasePath = `/account`;

// Session Api
// -------------------------------------------------------------------------------------
export namespace SessionApi {


  // POST
  export namespace Login {
    export const path = sessionBasePath + "/login";
  
    export interface Body {
      username: string;
      password: string;
      remember?: boolean;
    }
  
    export type Response = User;
  }
  
  
  
  // PUT
  export namespace Verify {
    export const path = sessionBasePath + "/verify-session";
  
    export type Response = User;
  }
  
  
  
  // DELETE
  export namespace Logout {
    export const path = sessionBasePath + "/logout";
  
    export type Response = string;
  }
}





// Account Api
// -------------------------------------------------------------------------------------
export namespace AccountApi {


  // PUT
  export namespace UpdateUsername {
    export const path = accountBasePath + '/username';
  
    export interface Body {
      username: string;
    }
  
    export type Response = string // Date string
  }
  
  
  
  // PUT
  export namespace UpdatePassword {
    export const path = accountBasePath + '/password';
  
    export interface Body {
      currentPassword: string;
      newPassword: string;
    }
  
    export type Response = boolean;
  }
  
  
  
  // PUT
  export namespace UpdateProfile {
    export const path = accountBasePath + '/profile';
  
    export interface Body {
      fullname: string;
      email: string;
      mobile: string;
    }
  
    export type Response = string // Date string
  }
  
  
  
  // PUT
  export namespace UpdateAvatar {
    export const path = accountBasePath + '/avatar';
  
    export interface Body { avatar: File; }
  
    export interface Response { path: string; }
  }
  
  
  
  // DELETE
  export namespace DeleteAvatar {
    export const path = accountBasePath + '/avatar';
  
    export type Response = string // Date string
  }
}