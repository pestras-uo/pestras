import { Dashboard } from "@pestras/shared/data-model";
import { Model } from "../model";
import { exists, getByTopic, getBySerial, search, titleExists } from "./read";
import { create } from "./create";
import { update } from "./update";
import { addSlide, removeSlide, updateSlide, updateSlidesOrder } from "./slides";
import { addView, removeView, updateView, updateViewDataViz, updateViewsOrder } from "./views";
import { addAccessGroup, addAccessOrgunit, addAccessUser, removeAccessGroup, removeAccessOrgunit, removeAccessUser } from "./access";
import { deleteDashboard } from "./delete";

export { CreateDashboardInput } from './create';
export { UpdateDashboardInput } from './update';
export { AddDashboardSlideInput, UpdateDashboardSlideInput } from './slides';
export { UpdateDashbaordViewInput } from './views';

export class DashboardsModel extends Model<Dashboard> {

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
  
  // data viz
  // ------------------------------------------------------------------------
  addView = addView.bind(this);
  updateViewsOrder = updateViewsOrder.bind(this);
  updateView = updateView.bind(this);
  updateViewDataViz = updateViewDataViz.bind(this);
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
  delete = deleteDashboard.bind(this);
}