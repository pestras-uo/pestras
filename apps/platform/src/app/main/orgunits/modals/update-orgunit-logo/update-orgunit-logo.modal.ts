/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Orgunit } from '@pestras/shared/data-model';
import { PuiFileInputError, ToastService } from '@pestras/frontend/ui';
import { Observable } from 'rxjs';
import { OrgunitsState } from '@pestras/frontend/state';

@Component({
  selector: 'app-update-orgunit-logo',
  templateUrl: './update-orgunit-logo.modal.html'
})
export class UpdateOrgunitLogoModal {
  logoControl = new FormControl<File | null>(null)

  preloader = false;
  currImage: string | null = null;

  errors: PuiFileInputError[] = [];

  @Input({ required: true })
  orgunit!: Orgunit;

  @Output()
  closes = new EventEmitter();

  constructor(
    private state: OrgunitsState,
    private toast: ToastService
  ) { }

  upload(c: Record<string, any>) {
    this.preloader = true;

    const file = this.logoControl.value;

    const req = file
      ? this.state.updateLogo({ serial: this.orgunit.serial }, { logo: file })
      : this.state.removeLogo({ serial: this.orgunit.serial });

    (req as Observable<string>).subscribe({
      next: () => {
        this.toast.msg(c['success'].orgunitLogoUpdate, { type: 'success' });
        this.closes.emit();
      },
      error: (e: any) => {
        console.error(e);

        this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
        this.preloader = false;
      }
    });
  }
}
