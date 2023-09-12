import {
  AuthModel,
  RegionsModel,
  OrgunitsModel,
  UsersModel,
  CommentsModel,
  NotificationsModel,
  ReportsModel,
  ActivitiesModel,
  AnalysisModel,
  DataVizModel,
  DashboardsModel,
  AttachmentsModel,
  ClientApiModel,
  ContentViewsModel,
  BlueprintsModel,
  TopicsModel,
  CategoriesModel,
  DataStoresModel,
  RecordWorkflowModel,
  DataRecordsModel,
  WorkspaceModel,
  UsersGroupsModel,
  EntityAccessModel
} from '@pestras/backend/models';

export const orgunitsModel = new OrgunitsModel('ad', 'orgunits');
export const usersModel = new UsersModel('ad', 'users');
export const authModel = new AuthModel('ad', 'auth');
export const regionsModel = new RegionsModel('ad', 'regions');
export const usersGroupsModel = new UsersGroupsModel('ad', 'groups');

export const entityAccessModel = new EntityAccessModel('uo', 'entitiesAccess');

export const activitiesModel = new ActivitiesModel('uo', 'activities');

export const contentModel = new ContentViewsModel('uo', 'contentViews');

export const blueprintsModel = new BlueprintsModel('uo', 'blueprints');
export const topicsModel = new TopicsModel('uo', 'topics');
export const categoriesModel = new CategoriesModel('uo-data', 'categories');
export const dataStoresModel = new DataStoresModel('uo', 'dataStores');
export const recordsWorkflowModel = new RecordWorkflowModel();
export const dataRecordsModel = new DataRecordsModel();
export const clientApiModel = new ClientApiModel('uo', 'clientsApi');

export const reportsModel = new ReportsModel('uo', 'reports');
export const dashboardsModel = new DashboardsModel('uo', 'dashboards');

export const commentsModel = new CommentsModel('uo-data', 'comments');
export const attachmentsModel = new AttachmentsModel('uo-data', 'attachments');
export const notificationsModel = new NotificationsModel('uo', 'notifications', usersModel, commentsModel, dataRecordsModel);

export const analysisModel = new AnalysisModel('uo', 'analysis');
export const dataVizModel = new DataVizModel('uo', 'dataViz');
export const workspaceModel = new WorkspaceModel('uo', 'workspaces');