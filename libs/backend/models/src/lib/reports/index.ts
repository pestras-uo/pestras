import { Report } from "@pestras/shared/data-model";
import { Model } from "../model";
import { create } from "./create";
import { deleteReport } from "./delete";
import { exists, getByTopic, getBySerial, search, titleExists } from "./read";
import { update } from "./update";
import { addView, removeView, updateView, updateViewContent, updateViewsOrder } from "./views";
import { addSlide, removeSlide, updateSlide, updateSlidesOrder } from "./slides";
import { addAccessGroup, addAccessOrgunit, addAccessUser, removeAccessGroup, removeAccessOrgunit, removeAccessUser } from "./access";

export { CreateReportInput } from './create';
export { UpdateReportInput } from './update';
export { UpdateReportViewInput } from './views';

export class ReportsModel extends Model<Report> {

  // read
  // ------------------------------------------------------------------------
  search = search.bind(this);
  getByTopic = getByTopic.bind(this);
  getBySerial = getBySerial.bind(this);
  exists = exists.bind(this);
  titleExists = titleExists.bind(this);

  // create
  // ------------------------------------------------------------------------
  create = create.bind(this);

  // update
  // ------------------------------------------------------------------------
  update = update.bind(this);

  // slides
  // ------------------------------------------------------------------------
  addSlide = addSlide.bind(this);
  updateSlidesOrder = updateSlidesOrder.bind(this);
  updateSlide = updateSlide.bind(this);
  removeSlide = removeSlide.bind(this);

  // views
  // ------------------------------------------------------------------------
  addView = addView.bind(this);
  updateViewsOrder = updateViewsOrder.bind(this);
  updateView = updateView.bind(this);
  updateViewContent = updateViewContent.bind(this);
  removeView = removeView.bind(this);

  // access
  // -------------------------------------------------------------------------------------
  addAccessOrgunit = addAccessOrgunit.bind(this);
  removeAccessOrgunit = removeAccessOrgunit.bind(this);
  addAccessUser = addAccessUser.bind(this);
  removeAccessUser = removeAccessUser.bind(this);
  addAccessGroup = addAccessGroup.bind(this);
  removeAccessGroup = removeAccessGroup.bind(this);

  // delete
  // ------------------------------------------------------------------------
  delete = deleteReport.bind(this);
}