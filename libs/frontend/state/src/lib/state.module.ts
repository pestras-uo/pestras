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
import { RecordsEntitiesState } from "./records/records-entities.state";
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

@NgModule({
  imports: [EnvModule]
})
export class StateModule {

  static forRoot(): ModuleWithProviders<StateModule> {

    return {
      ngModule: StateModule,
      providers: [
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
        RecordsEntitiesState,
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
        DataStoreResolver
      ]
    }
  }
}