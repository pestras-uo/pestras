/* eslint-disable @typescript-eslint/no-namespace */
import { Report, ReportSlide, ReportView } from "@pestras/shared/data-model";

const basePath = '/reports';

export namespace ReportsApi {


  // Read
  // ---------------------------------------------------------------------------------
  // GET
  export namespace GetByScope {
    export const REQ_PATH = basePath + '/topic/:topic';

    export interface Params { topic: string; }

    export type Response = Report[];
  }


  // GET
  export namespace GetBySerial {
    export const REQ_PATH = basePath + '/:serial';

    export interface Params { serial: string; }

    export type Response = Report | null;
  }


  // Create
  // ---------------------------------------------------------------------------------
  // POST
  export namespace Create {
    export const REQ_PATH = basePath;

    export type Body = Pick<Report, 'title' | 'topic'>;

    export type Response = Report;
  }


  // Update
  // ---------------------------------------------------------------------------------
  // PUT
  export namespace Update {
    export const REQ_PATH = basePath + '/:serial';

    export interface Params { serial: string; }

    export type Body = { title: string; };

    export type Response = string; // date
  }


  // Slides
  // ---------------------------------------------------------------------------------
  // POST
  export namespace AddSlide {
    export const REQ_PATH = basePath + '/:serial/slides';

    export interface Params { serial: string; }

    export type Body = { title: string; }

    export type Response = { slide: ReportSlide; date: string }; // date
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

    export type Body = { title: string; }

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

    export type Body = Omit<ReportView, 'serial'>;

    export type Response = { view: ReportView; date: string }; // date
  }


  // PUT
  export namespace UpdateViewsOrder {
    export const REQ_PATH = basePath + '/:serial/slides/:slide/views';

    export interface Params { serial: string; slide: string; }

    export interface Body { views: string[]; }

    export type Response = string; // date
  }


  // PUT
  export namespace UpdateViewContent {
    export const REQ_PATH = basePath + '/:serial/views/:view/content';

    export interface Params { serial: string; view: string; }

    export interface Body { content: string; }

    export type Response = string; // date
  }


  // PUT
  export namespace UpdateViewContentImage {
    export const REQ_PATH = basePath + '/:serial/views/:view/image';

    export interface Params { serial: string; view: string; }

    export interface Body { image: File; }

    export interface Response { path: string; date: string; } // date
  }


  // PUT
  export namespace UpdateView {
    export const REQ_PATH = basePath + '/:serial/views/:view';

    export interface Params { serial: string; view: string; }

    export type Body = Pick<ReportView, 'title' | 'sub_title'>;

    export type Response = string; // date
  }

  // DELETE
  export namespace RemoveView {
    export const REQ_PATH = basePath + '/:serial/views/:view';

    export interface Params { serial: string; view: string; }

    export type Response = string; // date
  }

}