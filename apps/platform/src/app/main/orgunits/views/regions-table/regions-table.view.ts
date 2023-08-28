/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, HostBinding, Input, OnChanges, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OrgunitsState, RegionsState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { Orgunit, Region } from '@pestras/shared/data-model';
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'orgunits-regions-table',
  templateUrl: './regions-table.view.html'
})
export class RegionsTableView implements OnChanges {
  private dialogRef: DialogRef | null = null;

  list$!: Observable<Region[]>;
  search = new FormControl<string>('', { nonNullable: true });
  page$ = new BehaviorSubject<number>(1);
  pageSize = 6;
  count!: number;
  preloader = false;
  skip = 0;

  readonly regionsControl = new FormControl<string[]>([], { nonNullable: true });

  @HostBinding('class')
  hostClass = 'card h-fit';

  @Input({ required: true })
  orgunit!: Orgunit;

  constructor(
    private orgsState: OrgunitsState,
    private state: RegionsState,
    private dialog: Dialog,
    private toast: ToastService
  ) { }

  ngOnChanges(): void {
    this.regionsControl.setValue(this.orgunit.regions);

    this.list$ = this.state.selectMany(region => this.orgunit.regions.includes(region.serial))
      .pipe(
        switchMap(regions => {
          return combineLatest([
            this.search.valueChanges.pipe(startWith('')),
            this.page$.pipe(distinctUntilChanged())
          ])
          .pipe(map(([search, page]) => {
            const searched = search ? regions.filter(o => o.name.includes(search)) : regions;
            this.count = searched.length;
            this.skip = (page - 1) * this.pageSize;
            return searched.slice(this.skip, this.skip + this.pageSize);
          }));
        })
      )
  }

  mapRegion(region: Region) {
    return { name: region.name, value: region.serial };
  }

  openDialog(tmp: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.preloader = false;
  }

  updateRegions(c: Record<string, any>) {
    this.preloader = true;

    this.orgsState.updateRegions(this.orgunit.serial, this.regionsControl.value)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].orgunitAdd, { type: 'success' });
          this.closeDialog();
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      })
  }
}
