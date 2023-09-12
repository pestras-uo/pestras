import { ModuleWithProviders, NgModule } from "@angular/core";
import { AttachmentsState } from "./attachments/attachments.state";
import { BlueprintsState } from "./blueprints/blueprints.state";
import { BlueprintResolver } from "./blueprints/blueprints.resolver";
import { CategoriesState } from "./categories/categories.state";
import { ClientApiState } from "./client-api/client-api.state";
import { ContentState } from "./content/content.state";
import { DashboardsState } from "./dashboards/dashboards.state";
import { DashboardResolver } from "./dashboards/dashboard.resolver";
import { OrgunitsState } from "./orgunits/orgunits.state";
import { RecordsState } from "./records/records.state";
import { RecordResolver } from "./records/record.resolver";
import { RegionsState } from "./regions/regions.state";
import { SessionState } from "./session/session.state";
import { SSEService } from "./sse/sse.service";
import { TopicsState } from "./topics/topics.state";
import { UsersGroupsState } from "./users-groups/users.groups.state";
import { WorkflowState } from "./workflow/workflow.state";
import { UsersState } from "./users/users.state";
import { WorkspaceState } from "./workspaces/workspace.state";
import { DataVizState } from "./data_viz/data-viz.state";
import { DataStoreResolver } from "./data-stores/data-store.resolver";
import { DataStoresState } from "./data-stores/data-stores.state";
import { EnvModule } from "@pestras/frontend/env";
import { ActivitiesState } from "./activities/activities.state";
import { ActivitiesService } from "./activities/activities.service";
import { AttachmentService } from "./attachments/attachments.service";
import { BlueprintsService } from "./blueprints/blueprints.service";
import { CategoriesService } from "./categories/categories.service";
import { ClientApiService } from "./client-api/client-api.service";
import { ContentService } from "./content/content.service";
import { DashboardsService } from "./dashboards/dashboards.service";
import { OrgunitsService } from "./orgunits/orgunits.service";
import { RecordsService } from "./records/records.service";
import { RegionsService } from "./regions/regions.service";
import { SessionService } from "./session/session.service";
import { TopicsService } from "./topics/topics.service";
import { UsersService } from "./users/users.service";
import { WorkflowService } from "./workflow/workflow.service";
import { UsersGroupsService } from "./users-groups/users-groups.service";
import { WorkspaceService } from "./workspaces/workspace.service";
import { DatavizService } from "./data_viz/data-viz.service";
import { DataStoresService } from "./data-stores/data-stores.service";
import { NotificationsService } from "./notifications/notifications.service";
import { NotificationsState } from "./notifications/notifications.state";
import { ReportsService } from "./reports/reports.service";
import { EntityAccessService } from "./entity-access/entity-access.service";
import { EntityAccessState } from "./entity-access/entity-access.state";

@NgModule({
  imports: [EnvModule],
  providers: [
    ActivitiesService,
    AttachmentService,
    BlueprintsService,
    CategoriesService,
    ClientApiService,
    ContentService,
    DashboardsService,
    OrgunitsService,
    RecordsService,
    RegionsService,
    ReportsService,
    SessionService,
    TopicsService,
    UsersService,
    WorkflowService,
    UsersGroupsService,
    WorkspaceService,
    DatavizService,
    DataStoresService,
    NotificationsService,
    EntityAccessService
  ]
})
export class StateModule {

  static forRoot(): ModuleWithProviders<StateModule> {

    return {
      ngModule: StateModule,
      providers: [
        ActivitiesState,
        AttachmentsState,
        BlueprintsState,
        BlueprintResolver,
        CategoriesState,
        ClientApiState,
        ContentState,
        DashboardsState,
        DashboardResolver,
        OrgunitsState,
        RecordsState,
        RecordResolver,
        RegionsState,
        SessionState,
        SSEService,
        TopicsState,
        UsersState,
        UsersGroupsState,
        WorkflowState,
        WorkspaceState,
        DataVizState,
        DataStoresState,
        DataStoreResolver,
        NotificationsState,
        EntityAccessState
      ]
    }
  }
}