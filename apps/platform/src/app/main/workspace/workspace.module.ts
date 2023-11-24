import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspacePage } from './workspace.page';
import { PinsView } from './views/pins/pins.view';
import { SlidesView } from './views/slides/slides.view';
import { ContraModule } from '@pestras/frontend/util/contra';
import { DialogModule } from '@angular/cdk/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import {
  PuiClickOutsideDirective,
  PuiDropdown,
  PuiIcon,
  PuiPreloaderModule,
  PuiSelectInput,
} from '@pestras/frontend/ui';
import { DashboardsFeaturesModule } from '@pestras/frontend/features/dashboards';
import { ReportsFeaturesModule } from '@pestras/frontend/features/reports';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { StatsView } from './views/stats/stats.view';
import { BlueprintsFeatureModule } from '@pestras/frontend/features/blueprints';
import { OrgunitsFeatureModule } from '@pestras/frontend/features/orgunits';
import { UsersFeatureModule } from '@pestras/frontend/features/users';
import { RegionsFeatureModule } from '@pestras/frontend/features/regions';
import { TopicsFeatureModule } from '@pestras/frontend/features/topics';
import { SessionFeatureModule } from '@pestras/frontend/features/session';
import { DataStoresFeatureModule } from "../../../../../../libs/frontend/features/data-stores/src/lib/data-stores.module";

@NgModule({
    declarations: [WorkspacePage, PinsView, SlidesView, StatsView],
    imports: [
        // Anguler
        CommonModule,
        WorkspaceRoutingModule,
        ReactiveFormsModule,
        // Util
        ContraModule,
        DialogModule,
        // Pui
        PuiPreloaderModule,
        PuiIcon,
        PuiSelectInput,
        PuiClickOutsideDirective,
        PuiDropdown,
        // Features
        SessionFeatureModule,
        BlueprintsFeatureModule,
        OrgunitsFeatureModule,
        UsersFeatureModule,
        RegionsFeatureModule,
        TopicsFeatureModule,
        DashboardsFeaturesModule,
        ReportsFeaturesModule,
        // Widgets
        NoDataPlaceholderWidget,
        DataStoresFeatureModule
    ]
})
export class WorkspaceModule {}
