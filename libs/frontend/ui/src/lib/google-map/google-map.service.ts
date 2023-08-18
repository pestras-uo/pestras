import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Observable, map, catchError, of, tap, shareReplay } from 'rxjs';

export const API_KEY = new InjectionToken<string>('API_KEY');

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {
  readonly mapApiLoaded$: Observable<boolean>;

  constructor(
    @Inject(API_KEY) private apiKey: string,
    httpClient: HttpClient
  ) {

    console.log('calling map apis')
    this.mapApiLoaded$ = httpClient
      .jsonp(`https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`, 'callback')
      .pipe(
        tap(() => console.log('map loaded')),
        map(() => true),
        shareReplay(1),
        catchError(e => {
          console.log(e)
          return of(false);
        }),
      );
  }
}
