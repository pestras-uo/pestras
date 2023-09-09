import { Injectable } from '@angular/core';
import { Attachment } from '@pestras/shared/data-model';
import { ApiQueryResults, StatorChannel, StatorQueryState } from '@pestras/frontend/util/stator';
import { AttachmentService } from './attachments.service';
import { Observable, map, tap } from 'rxjs';
import { SessionEnd } from '../session/session.events';

@Injectable({ providedIn: 'root' })
export class AttachmentsState extends StatorQueryState<Attachment> {

  constructor(
    private service: AttachmentService,
    private channel: StatorChannel
  ) {
    super('attachments', 'serial', ['10m']);

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());
  }

  protected override _fetchDoc(serial: string): Observable<Attachment | null> {
    return this.service.getBySerial({ serial });
  }

  protected override _fetchQuery(entity: string): Observable<ApiQueryResults<Attachment>> {
    return this.service.getByEntity({ entity })
      .pipe(map(res => ({ count: res.length, results: res })));
  }

  protected override _onChange(doc: Attachment): void {
    this._updateInQuery(doc.entity, doc);
  }

  protected override _onRemove(doc: Attachment): void {
    this._removeFromQuery(doc.entity, doc.serial);
  }

  // selectors
  // ---------------------------------------------------------------------------------------------
  selectGroup(entity: string) {
    return this.query(entity, null).pipe(map(d => d.results));
  }

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