import { Injectable } from '@angular/core';
import { Attachment } from '@pestras/shared/data-model';
import { StatorChannel, StatorGroupState } from '@pestras/frontend/util/stator';
import { AttachmentService } from './attachments.service';
import { Observable, tap } from 'rxjs';
import { SessionEnd } from '../session/session.events';

@Injectable({ providedIn: 'root' })
export class AttachmentsState extends StatorGroupState<Attachment> {

  constructor(
    private service: AttachmentService,
    private channel: StatorChannel
  ) {
    super('attachments', 'serial', 'entity', ['10m']);

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());
  }

  protected override _fetch(serial: string): Observable<Attachment | null> {
    return this.service.getBySerial({ serial });
  }

  protected override _fetchGroup(entity: string): Observable<Attachment[]> {
    return this.service.getByEntity({ entity });
  }

  // selectors
  // ---------------------------------------------------------------------------------------------
  create(entity: string, name: string, parent: string, file: File) {
    return this.service.create({ entity, name, parent, attachment: file })
      .pipe(tap(res => this._insert(res)));
  }

  updateName(serial: string, name: string) {
    return this.service.updateName({ serial }, { name })
      .pipe(tap(() => this._update(serial, { name })));
  }

  remove(serial: string) {
    return this.service.removeBySerial({ serial })
      .pipe(tap(() => this._delete(serial)));
  }
}