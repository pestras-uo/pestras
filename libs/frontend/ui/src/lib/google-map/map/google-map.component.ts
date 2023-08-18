/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, ViewChild, Input, Output, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { mapStyle } from '../map.style';
import { Subject } from 'rxjs';
import { GoogleMapService } from '../google-map.service';

export interface PuiMapMarkerInput {
  position: google.maps.LatLngLiteral,
  label: string;
}

export interface PuiMapPolygonOptions {
  coords: google.maps.LatLngLiteral[],
  fillColor: string;
  strokeColor: string;
}

@Component({
  selector: 'pui-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PuiGoogleMap implements OnInit {
  private readonly defaultPosition: google.maps.LatLngLiteral = {
    lat: 31.96232549914046,
    lng: 35.910937982131884
  };

  readonly ready$ = this.mapService.mapApiLoaded$;

  // map options
  options!: google.maps.MapOptions;

  // user position
  currPosition: google.maps.LatLngLiteral | null = null;

  // marker options
  pickMarkerPosition!: google.maps.LatLngLiteral;

  @ViewChild('map') map!: GoogleMap;

  @Input()
  set position(pos: google.maps.LatLngLiteral | null) {
    setTimeout(() => {
      if (pos && this.map) {
        this.map.panTo(pos);
        this.pickMarkerPosition = pos;
      }
    });
  }
  @Input()
  zoom = 13;
  @Input()
  mode: 'view' | 'pick' = 'view';
  @Input()
  markers: PuiMapMarkerInput[] = [];
  @Input()
  zoomControl = true;
  @Input()
  polygon: PuiMapPolygonOptions | null = null;

  @Output()
  pick = new Subject<google.maps.LatLngLiteral | null>();

  constructor(private readonly mapService: GoogleMapService) { }

  ngOnInit(): void {
    this.options = {
      disableDefaultUI: false,
      keyboardShortcuts: false,
      fullscreenControl: false,
      styles: mapStyle,
      zoomControl: this.zoomControl,
      controlSize: 24
    };

    if (this.position) {
      this.options.center = this.position;
      this.pickMarkerPosition = this.position;
    } else {
      this.options.center = this.defaultPosition;
      this.pickMarkerPosition = this.defaultPosition;
    }

    this.getCurrentPos();
  }

  private getCurrentPos() {
    navigator.geolocation.getCurrentPosition(
      pos => {
        this.currPosition = {
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


  setCurrent() {
    if (this.currPosition) {
      this.map.panTo(this.currPosition);
      this.pickMarkerPosition = this.currPosition;
    }
  }

  setCenter(pos: google.maps.LatLngLiteral) {
    this.map.panTo(pos);
  }

  drag() {
    // console.log('map dragged:', e);
    const center = this.map.getCenter();
    if (center) {
      this.pickMarkerPosition = { lat: center.lat(), lng: center.lng() };
    }
  }

  dragend() {
    const center = this.map.getCenter();
    if (center) {
      this.pickMarkerPosition = { lat: center.lat(), lng: center.lng() };
    }
  }

  exitPickMode(pos: google.maps.LatLngLiteral | null) {
    this.pick.next(pos);
    this.mode = 'view';
  }
}
