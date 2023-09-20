import { AuthModel } from "./active-directory/auth";
import { UsersGroupsModel } from "./active-directory/groups";
import { OrgunitsModel } from "./active-directory/orgunits";
import { RegionsModel } from "./active-directory/regions";
import { UsersModel } from "./active-directory/users";
import { ActivitiesModel } from "./activities";
import { AnalysisModel } from "./analysis";
import { AttachmentsModel } from "./attachments";
import { BlueprintsModel } from "./blueprints";
import { CategoriesModel } from "./blueprints/categories";
import { ClientApiModel } from "./blueprints/clients-api";
import { ClientsApiLogModel } from "./blueprints/clients-api-log";
import { DataStoresModel } from "./blueprints/data-stores";
import { RecordWorkflowModel } from "./blueprints/record-workflow";
import { DataRecordsModel } from "./blueprints/records";
import { TopicsModel } from "./blueprints/topics";
import { WebServiceLogModel } from "./blueprints/web-service-log";
import { WorkflowModel } from "./blueprints/workflow";
import { CommentsModel } from "./comments";
import { ContentViewsModel } from "./content-views";
import { DashboardsModel } from "./dashboards";
import { DataVizModel } from "./data-viz";
import { EntityAccessModel } from "./entity-access";
import { NotificationsModel } from "./notifications";
import { ReportsModel } from "./reports";
import { WorkspaceModel } from "./workspace";

export const orgunitsModel = new OrgunitsModel('ad', 'orgunits');
export const usersModel = new UsersModel('ad', 'users');
export const authModel = new AuthModel('ad', 'auth');
export const regionsModel = new RegionsModel('ad', 'regions');
export const usersGroupsModel = new UsersGroupsModel('ad', 'groups');

export const entityAccessModel = new EntityAccessModel('sys', 'entitiesAccess');

export const activitiesModel = new ActivitiesModel('sys', 'activities');

export const contentModel = new ContentViewsModel('sys', 'contentViews');

export const blueprintsModel = new BlueprintsModel('sys', 'blueprints');
export const topicsModel = new TopicsModel('sys', 'topics');
export const categoriesModel = new CategoriesModel('data', 'categories');
export const dataStoresModel = new DataStoresModel('sys', 'dataStores');
export const workflowModel = new WorkflowModel('sys', 'workflows');
export const webServiceLogModel = new WebServiceLogModel('sys', 'webServiceLog');
export const recordsWorkflowModel = new RecordWorkflowModel();
export const dataRecordsModel = new DataRecordsModel();
export const clientsApiModel = new ClientApiModel('sys', 'clientsApi');
export const clientsApiLogModel = new ClientsApiLogModel('data', 'clientsApiLog');

export const reportsModel = new ReportsModel('sys', 'reports');
export const dashboardsModel = new DashboardsModel('sys', 'dashboards');

export const commentsModel = new CommentsModel('data', 'comments');
export const attachmentsModel = new AttachmentsModel('data', 'attachments');
export const notificationsModel = new NotificationsModel('sys', 'notifications');

export const analysisModel = new AnalysisModel('sys', 'analysis');
export const dataVizModel = new DataVizModel('sys', 'dataViz');
export const workspaceModel = new WorkspaceModel('sys', 'workspaces');