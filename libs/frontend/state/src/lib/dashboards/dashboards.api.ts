/* eslint-disable @typescript-eslint/no-namespace */
import { ApiQuery, Dashboard, DashboardSlide, DashboardSlideView } from "@pestras/shared/data-model";

const basePath = '/dashboards';

export namespace DashboardsApi {


  // Read
  // ---------------------------------------------------------------------------------
  // GET
  export namespace GetByScope {
    export const REQ_PATH = basePath + '/topic/:topic';

    export interface Params { topic: string; }

    export type Response = Dashboard[];
  }


  // GET
  export namespace GetBySerial {
    export const REQ_PATH = basePath + '/:serial';

    export interface Params { serial: string; }

    export type Response = Dashboard | null;
  }


  // POST
  export namespace Search {
    export const REQ_PATH = basePath + '/search';

    export type Body = Partial<ApiQuery<Dashboard>>;

    export type Response = { count: number; results: Dashboard[] };
  }


  // Create
  // ---------------------------------------------------------------------------------
  // POST
  export namespace Create {
    export const REQ_PATH = basePath;

    export type Body = Pick<Dashboard, 'topic' | 'title'>;

    export type Response = Dashboard;
  }


  // Update
  // ---------------------------------------------------------------------------------
  // PUT
  export namespace Update {
    export const REQ_PATH = basePath + '/:serial';

    export interface Params { serial: string; }

    export interface Body { title: string; };

    export type Response = string; // date
  }


  // Slides
  // ---------------------------------------------------------------------------------
  // POST
  export namespace AddSlide {
    export const REQ_PATH = basePath + '/:serial/slides';

    export interface Params { serial: string; }

    export type Body = Pick<DashboardSlide, 'title' | 'play_time'>

    export type Response = { slide: DashboardSlide; date: string }; // date
  }

  // PUT
  export namespace UpdateSlidesOrder {
    export const REQ_PATH = basePath + '/:serial/slides';

    export interface Params { serial: string; }

    export interface Body { slides: string[]; }

    export type Response = string; // date
  }


  // PUT
  export namespace UpdateSlide {
    export const REQ_PATH = basePath + '/:serial/slides/:slide';

    export interface Params { serial: string; slide: string; }

    export type Body = Pick<DashboardSlide, 'title' | 'play_time'>

    export type Response = string; // date
  }


  // DELETE
  export namespace RemoveSlide {
    export const REQ_PATH = basePath + '/:serial/slides/:slide';

    export interface Params { serial: string; slide: string; }

    export type Response = string; // date
  }


  // Views
  // ---------------------------------------------------------------------------------
  // POST
  export namespace AddView {
    export const REQ_PATH = basePath + '/:serial/views';

    export interface Params { serial: string; }

    export type Body = Omit<DashboardSlideView, 'serial'>;

    export type Response = { view: DashboardSlideView; date: string }; // date
  }


  // PUT
  export namespace UpdateViewsOrder {
    export const REQ_PATH = basePath + '/:serial/slides/:slide/views';

    export interface Params { serial: string; slide: string; }

    export interface Body { views: string[]; }

    export type Response = string; // date
  }


  // PUT
  export namespace UpdateViewDataViz {
    export const REQ_PATH = basePath + '/:serial/views/:view/data-viz/:dataViz';

    export interface Params { serial: string; view: string; dataViz: string; }

    export type Response = string; // date
  }


  // PUT
  export namespace UpdateView {
    export const REQ_PATH = basePath + '/:serial/views/:view';

    export interface Params { serial: string; view: string; }

    export type Body = Omit<DashboardSlideView, 'data_viz' | 'slide' | 'serial'>

    export type Response = string; // date
  }




  // DELETE
  export namespace RemoveView {
    export const REQ_PATH = basePath + '/:serial/views/:view';

    export interface Params { serial: string; view: string; }

    export type Response = string; // date
  }



  // Access
  // --------------------------------------------------------------------------------------
  // POST
  export namespace AddAccessOrgunit {
    export const path = basePath + '/:serial/access/orgunits/:orgunit';

    export interface Params { serial: string; orgunit: string; }

    export type Response = boolean;
  }
  // DELETE
  export namespace RemoveAccessOrgunit {
    export const path = basePath + '/:serial/access/orgunits/:orgunit';

    export interface Params { serial: string; orgunit: string; }

    export type Response = boolean;
  }

  // POST
  export namespace AddAccessUser {
    export const path = basePath + '/:serial/access/users/:user';

    export interface Params { serial: string; user: string; }

    export type Response = boolean;
  }
  // DELETE
  export namespace RemoveAccessUser {
    export const path = basePath + '/:serial/access/users/:user';

    export interface Params { serial: string; user: string; }

    export type Response = boolean;
  }

  // POST
  export namespace AddAccessGroup {
    export const path = basePath + '/:serial/access/groups/:group';

    export interface Params { serial: string; group: string; }

    export type Response = boolean;
  }
  // DELETE
  export namespace RemoveAccessGroup {
    export const path = basePath + '/:serial/access/groups/:group';

    export interface Params { serial: string; group: string; }

    export type Response = boolean;
  }
}