import { Router } from "express";
import { accountRoutes } from "./account";
import { categoriesRoutes } from "./categories";
import { dataStoresRoutes } from "./data-stores";
import { regionsRoutes } from "./region";
import { notificationsRoutes } from "./notifications";
import { orgunitRoutes } from "./orgunits";
import { sessionRoutes } from "./session";
import { usersRoutes } from "./users";
import { reportsRoutes } from "./reports";
import { commentsRoutes } from "./comments";
import { analysisRoutes } from "./analysis";
import { dataVizRoutes } from "./data-viz";
import { dashboardsRoutes } from "./dashboards";
import { attachmentsRoutes } from "./attachments";
import { clientsApiRoutes } from "./clients_api";
import { contentViewsRoutes } from "./content";
import { blueprintsRoutes } from "./blueprints";
import { topicsRoutes } from "./topics";
import { workflowRoutes } from "./workflow";
import { workspacesRouter } from "./workspace";
import { usersGroupsRoutes } from "./groups";
import { activitiesRouter } from "./activities";
import { entityAccessRouter } from "./entity-access";

export default Router()
  // active directory
  .use('/session', sessionRoutes)
  .use('/account', accountRoutes)
  .use('/users', usersRoutes)
  .use('/orgunits', orgunitRoutes)
  .use('/regions', regionsRoutes)
  .use('/users-groups', usersGroupsRoutes)
  // access
  .use('/access', entityAccessRouter)
  //blueprints
  .use('/blueprints', blueprintsRoutes)
  .use('/topics', topicsRoutes)
  .use('/categories', categoriesRoutes)
  .use('/data-stores', dataStoresRoutes)
  .use('/workflow', workflowRoutes)
  // export
  .use('/client-api', clientsApiRoutes)
  // statistics and analysis
  .use('/reports', reportsRoutes)
  .use('/dashboards', dashboardsRoutes)
  .use('/analysis', analysisRoutes)
  .use('/data-viz', dataVizRoutes)
  // features
  .use('/activities', activitiesRouter)
  .use('/workspaces', workspacesRouter)
  .use('/content-views', contentViewsRoutes)
  .use('/attachments', attachmentsRoutes)
  .use('/comment', commentsRoutes)
  .use('/notifications', notificationsRoutes);