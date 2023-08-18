import { Validall } from "@pestras/validall";
import { ReportViewType } from "@pestras/shared/data-model";

export enum ReportValidators {
  CREATE = 'createReport',
  UPDATE = 'updateReport',
  ADD_SLIDE = 'addReportSlide',
  ORDER_SLIDES = 'updateReportSlidesOrder',
  UPDATE_SLIDE = 'updateReportSlide',
  ADD_VIEW = 'addReportView',
  ADD_ANALYSIS_VIEW = 'addReportAnalysisView',
  ADD_DATA_VIZ_VIEW = 'addReportDataVizView',
  ORDER_VIEWS = 'updateDashboardViewsOrder',
  UPDATE_VIEW = 'updateReportView',
  UPDATE_VIEW_CONTENT = 'updateReportViewContent'
}

new Validall(ReportValidators.CREATE, {
  topic: { $type: 'string' },
  title: { $type: 'string' }
});

new Validall(ReportValidators.UPDATE, {
  title: { $type: 'string' }
});

new Validall(ReportValidators.ADD_SLIDE, {
  title: { $type: 'string' },
});

new Validall(ReportValidators.ORDER_SLIDES, {
  slides: { $is: 'notEmpty', $each: { $type: 'string' } }
});

new Validall(ReportValidators.UPDATE_SLIDE, {
  title: { $type: 'string' },
});

new Validall(ReportValidators.ADD_VIEW, {
  slide: { $default: '', $type: 'string' },
  title: { $default: '', $type: 'string' },
  sub_title: { $default: '', $type: 'string' },
  type: {
    $enum: [
      ReportViewType.RICH_TEXT,
      ReportViewType.IMAGE,
      ReportViewType.VIDEO,
      ReportViewType.DATA_VIZ
    ],
  },
  content: { $default: '', $type: 'string' }
});

new Validall(ReportValidators.ORDER_VIEWS, {
  views: { $is: 'notEmpty', $each: { $type: 'string' } }
});

new Validall(ReportValidators.UPDATE_VIEW, {
  title: { $default: '', $type: 'string' },
  subTitle: { $default: '', $type: 'string' }
});

new Validall(ReportValidators.UPDATE_VIEW_CONTENT, {
  content: { $type: 'string' }
});