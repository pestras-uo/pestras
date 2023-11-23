/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RegionsState } from "@pestras/frontend/state";
import { ToastService } from "@pestras/frontend/ui";
import { GISMapConfig } from "@pestras/shared/data-model";

@Component({
  selector: 'pestras-update-gis-map-modal',
  templateUrl: './update-gis-map.modal.component.html'
})
export class UpdateGisMapModalComponent implements OnInit {

  readonly updateForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    id: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    portal: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    basemap: new FormControl<string>('', { nonNullable: true, validators: Validators.required })
  });

  readonly apiKeyForm = new FormGroup({
    apiKey: new FormControl<string | null>(null)
  });

  tab = 'update';
  preloader = false; 

  @Input({ required: true })
  region!: string;
  @Input({ required: true })
  map!: GISMapConfig;

  @Output()
  closes = new EventEmitter();

  constructor(
    private state: RegionsState,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm.controls.name.setValue(this.map.name);
    this.updateForm.controls.id.setValue(this.map.id);
    this.updateForm.controls.portal.setValue(this.map.portal);
    this.updateForm.controls.basemap.setValue(this.map.basemap);
  }

  update(c: Record<string, any>) {
    this.preloader = true;

    this.state.updateGisMap(this.region, this.map.serial, this.updateForm.getRawValue())
      .subscribe({
        next: () => this.closes.emit(),
        error: e => {
          console.error(e);
          this.toast.msg(c['errors'][e?.error ?? 'default'], { type: 'error' });
          this.preloader = false;
        }
      });
  }

  updateApiKey(c: Record<string, any>) {
    this.preloader = true;

    this.state.updateGisMapApiKey(this.region, this.map.serial, this.apiKeyForm.getRawValue().apiKey)
      .subscribe({
        next: () => this.closes.emit(),
        error: e => {
          console.error(e);
          this.toast.msg(c['errors'][e?.error ?? 'default'], { type: 'error' });
          this.preloader = false;
        }
      });
  }
}