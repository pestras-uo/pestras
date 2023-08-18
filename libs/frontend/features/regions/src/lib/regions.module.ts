import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionsPipe } from './pipes/regions.pipe';
import { RegionPipe } from './pipes/region.pipe';
import { OrgunitRegionsPipe } from './pipes/orgunit-regions.pipe';
import { UserRegionsPipe } from './pipes/user-regions.pipe';



@NgModule({
  declarations: [
    RegionsPipe,
    RegionPipe,
    OrgunitRegionsPipe,
    UserRegionsPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RegionsPipe,
    RegionPipe,
    OrgunitRegionsPipe,
    UserRegionsPipe
  ]
})
export class RegionsFeatureModule { }
