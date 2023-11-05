import {
  Component,
  ViewChild,
  Input,
  Output,
  ChangeDetectionStrategy,
  booleanAttribute,
  OnChanges,
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { mapStyle, mapStyleDark } from '../map.style'; // Importing map styles
import { Subject } from 'rxjs';
import { GoogleMapService } from '../google-map.service';

// Interface for marker input data
export interface PuiMapMarkerInput {
  position: google.maps.LatLngLiteral;
  label: string;
}

// Interface for polygon options
export interface PuiMapPolygonOptions {
  coords: google.maps.LatLngLiteral[];
  fillColor: string;
  strokeColor: string;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'pui-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class PuiGoogleMap implements OnChanges {
  private readonly defaultPosition: google.maps.LatLngLiteral = {
    lat: 31.96232549914046,
    lng: 35.910937982131884,
  };

  readonly ready$ = this.mapService.mapApiLoaded$;

  // Map options
  options!: google.maps.MapOptions;

  // User position
  currPosition: google.maps.LatLngLiteral | null = null;

  // Marker options
  pickMarkerPosition!: google.maps.LatLngLiteral;

  // Inputs
  @ViewChild('map') map!: GoogleMap;
  @Input() position: google.maps.LatLngLiteral | null = null;
  @Input() zoom = 13;
  @Input() mode: 'view' | 'pick' = 'view';
  @Input() markers: PuiMapMarkerInput[] = [];
  @Input() zoomControl = true;
  @Input() polygon: PuiMapPolygonOptions | null = null;

  // Output event
  @Output() pick = new Subject<google.maps.LatLngLiteral | null>();

  constructor(
    private readonly mapService: GoogleMapService,
  ) {}
  @Input({ transform: booleanAttribute })
  dark = false;
  ngOnChanges(): void {
    // Initializing map options
    this.options = {
      disableDefaultUI: false,
      keyboardShortcuts: false,
      fullscreenControl: false,
      styles: this.dark ? mapStyleDark : mapStyle,
      zoomControl: this.zoomControl,
      controlSize: 24,
    };

    // Setting initial map position
    if (this.position) {
      this.options.center = this.position;
      this.pickMarkerPosition = this.position;
    } else {
      this.options.center = this.defaultPosition;
      this.pickMarkerPosition = this.defaultPosition;
    }

    // Getting user's current position
    this.getCurrentPos();
  }

  // Function to get current geolocation
  private getCurrentPos() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.currPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
      },
      (err) => {
        // Handle geolocation errors
        console.warn('Geolocation error:', err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
      }
    );
  }

  // Function to set map center to user's current position
  setCurrent() {
    if (this.currPosition) {
      this.map.panTo(this.currPosition);
      this.pickMarkerPosition = this.currPosition;
    }
  }

  // Function to set map center to a specific position
  setCenter(pos: google.maps.LatLngLiteral) {
    this.map.panTo(pos);
  }

  // Function to handle map dragging
  drag() {
    const center = this.map.getCenter();
    if (center) {
      this.pickMarkerPosition = { lat: center.lat(), lng: center.lng() };
    }
  }

  // Function to handle map drag end
  dragend() {
    const center = this.map.getCenter();
    if (center) {
      this.pickMarkerPosition = { lat: center.lat(), lng: center.lng() };
    }
  }

  // Function to exit pick mode and emit picked location
  exitPickMode(pos: google.maps.LatLngLiteral | null) {
    this.pick.next(pos);
    this.mode = 'view';
  }
}
