import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionsPipe } from './pipes/regions.pipe';
import { RegionPipe } from './pipes/region.pipe';
import { OrgunitRegionsPipe } from './pipes/orgunit-regions.pipe';
import { UserRegionsPipe } from './pipes/user-regions.pipe';
import { RegionsCountPipe } from './pipes/count.pipe';



@NgModule({
  declarations: [
    RegionsPipe,
    RegionPipe,
    OrgunitRegionsPipe,
    UserRegionsPipe,
    RegionsCountPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RegionsPipe,
    RegionPipe,
    OrgunitRegionsPipe,
    UserRegionsPipe,
    RegionsCountPipe
  ]
})
export class RegionsFeatureModule { }
