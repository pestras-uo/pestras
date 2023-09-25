import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicsListView } from './views/topics-list/topics-list.view';
import { BlueprintsFeatureModule } from '@pestras/frontend/features/blueprints';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PuiIcon, PuiPreloaderModule, PuiSelectInput, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { ContraModule } from '@pestras/frontend/util/contra';
import { DialogModule } from '@angular/cdk/dialog';
import { AddTopicModal } from './modals/add-topic/add-topic.modal';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { TopicsPipe } from './pipes/topics.pipe';
import { TopicsCountPipe } from './pipes/count.pipe';
import { TopicPipe } from './pipes/topic.pipe';



@NgModule({
  declarations: [
    TopicsListView,
    AddTopicModal,
    TopicsPipe,
    TopicsCountPipe,
    TopicPipe
  ],
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // Features
    BlueprintsFeatureModule,
    // PUI
    PuiSelectInput,
    PuiPreloaderModule,
    PuiIcon,
    PuiUtilPipesModule,
    // Util
    ContraModule,
    DialogModule,
    // Widgets
    NoDataPlaceholderWidget
  ],
  exports: [
    TopicsListView,
    AddTopicModal,
    TopicsPipe,
    TopicsCountPipe,
    TopicPipe
  ]
})
export class TopicsFeatureModule { }
