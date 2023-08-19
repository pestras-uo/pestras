import { Validall } from "@pestras/validall";

export enum dashboardsValidators {
  CREATE = 'createDashboard',
  UPDATE = 'updateDashBoard',
  ADD_SLIDE = 'addDashboardSlide',
  ORDER_SLIDES = 'updateDashboardSlidesOrder',
  UPDATE_SLIDE = 'updateDashboardSlide',
  ADD_VIEW = 'addDashboardView',
  ORDER_VIEWS = 'updateDashboardViewsOrder',
  UPDATE_VIEW = 'updateDashboardView',
  UPDATE_VIEW_CONTENT = 'updateDashboardViewContent',
}

new Validall(dashboardsValidators.CREATE, {
  topic: { $type: 'string' },
  title: { $type: 'string' }
});

new Validall(dashboardsValidators.UPDATE, {
  title: { $type: 'string' }
});

new Validall(dashboardsValidators.ADD_SLIDE, {
  title: { $type: 'string' },
  play_time: { $default: 60, $type: 'number' }
});

new Validall(dashboardsValidators.ORDER_SLIDES, {
  slides: { $is: 'notEmpty', $each: { $type: 'string' } }
});

new Validall(dashboardsValidators.UPDATE_SLIDE, {
  title: { $type: 'string' },
  play_time: { $default: 60, $type: 'number' }
});

new Validall(dashboardsValidators.ADD_VIEW, {
  title: { $type: 'string' },
  slide: { $type: 'string' },
  sub_title: { $type: 'string', $default: '' },
  mode: { $enum: ['light', 'dark'], $default: 'light' },
  size: {
    x: { $enum: [3,4,6,8,9,12] },
    y: { $enum: [1,2] }
  }
});

new Validall(dashboardsValidators.ORDER_VIEWS, {
  views: { $is: 'notEmpty', $each: { $type: 'string' } }
});

new Validall(dashboardsValidators.UPDATE_VIEW, {
  title: { $type: 'string' },
  sub_title: { $type: 'string', $default: '' },
  mode: { $enum: ['light', 'dark'], $default: 'light' },
  size: {
    x: { $enum: [3,4,6,8,9,12] },
    y: { $enum: [1,2] }
  }
});

new Validall(dashboardsValidators.UPDATE_VIEW_CONTENT, {
  content: { $type: 'string' }
});