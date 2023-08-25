/* eslint-disable @typescript-eslint/no-namespace */

const basePath = '/activities';

export interface ActivityStats {
  user: string;
  activities: [string, number][];
}

export namespace ActivitesAPi {

  export namespace GetLastWeek {
    export const REQ_PATH = basePath + '/week/:serial';

    export interface Params { serial: string; }

    export type Response = ActivityStats;
  }

  export namespace GetLastMonth {
    export const REQ_PATH = basePath + '/month/:serial';

    export interface Params { serial: string; }

    export type Response = ActivityStats;
  }

  export namespace GetLastYear {
    export const REQ_PATH = basePath + '/year/:serial';

    export interface Params { serial: string; }

    export type Response = ActivityStats;
  }
}