export enum EntityTypes {
  // active directory
  REGION = 'region',
  ORGUNIT = 'orgunit',
  USER = 'user',
  GROUP = 'group',
  
  // blueprints
  BLUEPRINT = 'blurprint',
  TOPIC = 'blurprint_instance',
  CATEGORY = 'category',
  DATA_STORE = 'datastore',
  RECORD = 'record',
  CLIENT_API = 'client_api',
  WORKFLOW = 'workflow',
  
  // bussiness
  THEME = 'theme',
  ANALYSIS = 'analysis',
  DATA_VIZ = 'data_viz',
  REPORT = 'report',
  DASHBOARD = 'dashboard',

  // features
  INBOX = 'inbox',
  MESSAGE = 'message',
  ATTACHMENT = 'attachment',
  COMMENT = 'comment',
  CONTENT_VIEW = 'content_view',
  NOTIFICATION = 'notification'
}