import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuiGoogleMap } from './map/google-map.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { PuiIcon } from '../icon/icon.directive';
import { API_KEY } from './google-map.service';
import { PuiLocationInput } from './location-input/location-input.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PuiGoogleMap, PuiLocationInput],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    GoogleMapsModule,
    PuiIcon,
  ],
  exports: [PuiGoogleMap, PuiLocationInput],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PuiGoogleMapModule {
  static forRoot(apiKey: string): ModuleWithProviders<PuiGoogleMapModule> {
    return {
      ngModule: PuiGoogleMapModule,
      providers: [{ provide: API_KEY, useValue: apiKey }],
    };
  }
}
