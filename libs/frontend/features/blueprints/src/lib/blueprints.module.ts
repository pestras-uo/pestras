import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlueprintPipe } from './pipes/blueprint.pipe';
import { BlueprintsPipe } from './pipes/blueprints.pipe';
import { StateModule } from '@pestras/frontend/state';
import { BlueprintsCountPipe } from './pipes/count.pipe';



@NgModule({
  declarations: [
    BlueprintPipe,
    BlueprintsPipe,
    BlueprintsCountPipe
  ],
  imports: [
    CommonModule,
    // state
    StateModule
  ],
  exports: [
    BlueprintPipe,
    BlueprintsPipe,
    BlueprintsCountPipe
  ]
})
export class BlueprintsFeatureModule { }
