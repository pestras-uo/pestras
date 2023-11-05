/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { Region } from '@pestras/shared/data-model';
import { RegionsState } from '@pestras/frontend/state';
import { Observable, map, tap } from 'rxjs';
import { PuiMapPolygonOptions, ToggleThemeService } from '@pestras/frontend/ui';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-region-details',
  templateUrl: './region-details.view.html',
  styleUrls: ['./region-details.view.scss'],
})
export class RegionDetailsView implements OnChanges {
  private dialogRef: DialogRef | null = null;

  region$!: Observable<Region | null>;

  polygon: PuiMapPolygonOptions | null = null;

  zoom = 13;

  @Input({ required: true })
  serial!: string;

  theme$ = this.toggleThemeService.isDarkMode$.pipe(
    map((isdark) => (isdark ? 'dark' : 'light'))
  );

  constructor(
    private readonly state: RegionsState,
    private readonly dialog: Dialog,
    protected toggleThemeService: ToggleThemeService
  ) {}

  ngOnChanges(): void {
    this.region$ = this.state.select(this.serial).pipe(
      tap((r) => {
        if (r) {
          this.zoom = r.zoom ?? 13;

          if (r.coords?.coordinates) {
            const coordinates = r.coords.coordinates.reduce(
              (
                coords: { lat: number; lng: number }[],
                curr: { lat: number; lng: number }[]
              ) => {
                return coords.concat(curr);
              },
              [] as { lat: number; lng: number }[]
            );

            this.polygon = {
              fillColor: '#1dc973',
              strokeColor: '#1dc973',
              coords: coordinates,
            };
          } else {
            this.polygon = null;
          }
        }
      })
    );
  }

  openModal(ref: TemplateRef<any>, data?: any) {
    this.dialogRef = this.dialog.open(ref, { data });
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }
}
