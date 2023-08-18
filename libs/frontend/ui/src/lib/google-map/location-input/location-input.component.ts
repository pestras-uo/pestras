/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { PuiGoogleMap } from '../map/google-map.component';
import { combineLatest, filter, map, Subscription } from 'rxjs';
import { getLocationFromLink } from '@pestras/shared/util';

@Component({
  selector: 'pui-location-input',
  templateUrl: './location-input.component.html',
  styleUrls: ['./location-input.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => PuiLocationInput) },
    { provide: NG_VALIDATORS, multi: true, useExisting: forwardRef(() => PuiLocationInput) }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PuiLocationInput implements OnInit, OnDestroy {
  private linkSub?: Subscription;
  private locSub?: Subscription;

  mapOpen = false;
  disabled = false;
  touched = false;
  position: google.maps.LatLngLiteral | null = null;
  state = 0;
  currentPosition!: google.maps.LatLngLiteral;

  readonly linkControl = new FormControl('', { validators: Validators.required, nonNullable: true });
  readonly latControl = new FormControl('', { validators: Validators.required, nonNullable: true });
  readonly lngControl = new FormControl('', { validators: Validators.required, nonNullable: true });
  
  @Input()
  map: PuiGoogleMap | null = null;

  constructor() {
    this.cacheCurrentPosition();
  }

  ngOnInit(): void {
    this.linkSub = this.linkControl.valueChanges
      .pipe(
        filter(() => this.state === 3),
        map(link => getLocationFromLink(link) ?? null)
      )
      .subscribe(pos => {
        this.position = pos;
        this.onChange(this.position);
        this.touched || ((this.touched = true) || this.onTouched());
      });

    this.locSub = combineLatest([this.latControl.valueChanges, this.lngControl.valueChanges])
      .pipe(
        filter(() => this.state === 4),
        map(loc => loc[0] && loc[1] ? { lat: +loc[0], lng: +loc[1] } : null)
      )
      .subscribe(pos => {
        this.position = pos;
        this.onChange(this.position);
        this.touched || ((this.touched = true) || this.onTouched());
      });
  }

  ngOnDestroy(): void {
    !!this.linkSub && this.linkSub.unsubscribe();
    !!this.locSub && this.locSub.unsubscribe();
  }

  cacheCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
      pos => {
        this.currentPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
      },
      err => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            console.warn("User denied the request for Geolocation.");
            break;
          case err.POSITION_UNAVAILABLE:
            console.warn("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            console.warn("The request to get user location timed out.");
            break;
          default:
            console.warn("An unknown error occurred.");
            break;
        }
      }, {
      enableHighAccuracy: true,
      maximumAge: 60_000
    });
  }

  setNull() {
    this.reset();
    this.state = 0;
    this.position = null;
    this.onChange(this.position);
    this.touched || ((this.touched = true) || this.onTouched());
  }

  setCurrent() {
    this.reset();
    this.state = 1;
    this.position = this.currentPosition;
    this.onChange(this.position);
    this.touched || ((this.touched = true) || this.onTouched());
  }

  openMap() {
    this.reset();
    this.state = 2;
    this.mapOpen = true;
    this.disabled = true;
  }

  mapDismiss(pos: google.maps.LatLngLiteral | null) {
    if (pos) {
      this.state = 2;
      this.position = pos;
    } else {
      this.position = null;
    }
    
    this.onChange(this.position);
    this.touched || ((this.touched = true) || this.onTouched());
    this.mapOpen = false;
    this.disabled = false;
  }

  useUrl() {
    this.reset();
    this.state = 3;
  }

  manual() {
    this.reset();
    this.state = 4;
  }

  reset() {
    this.linkControl.setValue('');
    this.latControl.setValue('');
    this.lngControl.setValue('');
  }

  // ControlValueAccessor
  // --------------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(pos: google.maps.LatLngLiteral | null) {
    if (pos && pos.lat && pos.lng) {
      this.position = pos;
      this.state = 2;
    }
    else if (pos === null)
      this.position = null;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  validate(_: AbstractControl): ValidationErrors | null {
    return null;
  }
}
