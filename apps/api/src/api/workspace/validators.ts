import { WorkspacePinType } from "@pestras/shared/data-model";
import { Validall } from "@pestras/validall";

export enum WorkspaceValidators {
  ADD_GROUP = 'addWorkspaceGroup',
  UPDATE_GROUP = 'updateWorkspaceGroup',
  ADD_PIN = 'addWorkspacePin',
  ADD_SLIDE = 'addWorkspaceSlide'
};

new Validall(WorkspaceValidators.ADD_GROUP, {
  name: { $type: 'string' }
});

new Validall(WorkspaceValidators.UPDATE_GROUP, {
  name: { $type: 'string' }
});

new Validall(WorkspaceValidators.ADD_PIN, {
  serial: { $type: 'string' },
  name: { $type: 'string' },
  group: { $type: 'string' },
  scope: { $type: 'string', $nullable: true },
  type: {
    $enum: [
      WorkspacePinType.BLUEPRINTS,
      WorkspacePinType.DASHBOARDS,
      WorkspacePinType.REPORTS,
      WorkspacePinType.DATA_STORES,
      WorkspacePinType.TOPICS
    ]
  }
});

new Validall(WorkspaceValidators.ADD_SLIDE, {
  name: { $type: 'string' },
  dashboard: { $type: 'string' },
  slide: { $type: 'string' },
  scope: { $type: 'string', $nullable: true }
});