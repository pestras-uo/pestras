import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlueprintPipe } from './pipes/blueprint.pipe';
import { BlueprintsPipe } from './pipes/blueprints.pipe';
import { StateModule } from '@pestras/frontend/state';



@NgModule({
  declarations: [
    BlueprintPipe,
    BlueprintsPipe
  ],
  imports: [
    CommonModule,
    // state
    StateModule
  ],
  exports: [
    BlueprintPipe,
    BlueprintsPipe
  ]
})
export class BlueprintsFeatureModule { }
