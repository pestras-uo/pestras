import { Injectable } from '@angular/core';
import { Blueprint, EntityTypes } from '@pestras/shared/data-model';
import { StatorChannel, StatorCollectionState } from '@pestras/frontend/util/stator';
import { BlueprintsService } from './blueprints.service';
import { SessionEnd, SessionStart } from '../session/session.events';
import { tap, filter } from 'rxjs';
import { SSEActivity } from '..//sse/sse.events';

@Injectable({ providedIn: 'root' })
export class BlueprintsState extends StatorCollectionState<Blueprint> {

  constructor(
    private service: BlueprintsService,
    private channel: StatorChannel
  ) {
    super('blueprints', 'serial', ['1h'], true);

    this.initListeners();
  }

  private initListeners() {
    // when session starts fetch all related blueprints
    this.channel.select(SessionStart)
      .pipe(tap(() => this._init()))
      .subscribe(() => this._setLoading(false));

    // when session ends clear state
    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());

    // sse events
    this.channel.select(SSEActivity)
      .pipe(filter(act => act.entity === EntityTypes.BLUEPRINT))
      .subscribe(act => {
        // new blueprint
        if (act.method === 'create')
          this.service.getBySerial({ serial: act.serial })
            .subscribe(b => !!b && this._insert(b));

        // update blueprint
        else if (act.method === 'update')
          this._update(act.serial, { ...act.payload, last_modified: act.create_date });

        // new Owner
        else if (act.method === 'setOwner')
          this._update(act.serial, { owner: act.payload['owner'] });

        // add collaborator
        else if (act.method === 'addCollaborator')
          this._update(act.entity, b => ({ ...b, collaborators: [...b.collaborators, act.payload['collaborator']] }));

        // remove collaborator
        else if (act.method === 'removeCollaborator')
          this._update(act.entity, b => ({ ...b, collaborators: b.collaborators.filter(c => c !== act.payload['collaborator']) }));
      });
  }

  protected override _load() {
    return this.service.getAll();
  }

  create(name: string) {
    return this.service.create({ name })
      .pipe(tap(bp => this._insert(bp)));
  }

  update(serial: string, name: string) {
    return this.service.update({ serial }, { name })
      .pipe(tap(date => this._update(serial, { name, last_modified: new Date(date) })));
  }

  addCollaborator(serial: string, collaborator: string) {
    return this.service.addCollaborator({ serial, collaborator })
      .pipe(tap(date => this._update(serial, ds => {
        return {
          ...ds,
          collaborators: ds.collaborators.concat(collaborator),
          last_modified: new Date(date)
        }
      })));
  }

  removeCollaborator(serial: string, collaborator: string) {
    return this.service.removeCollaborator({ serial, collaborator })
      .pipe(tap(date => this._update(serial, ds => {
        return {
          ...ds,
          collaborators: ds.collaborators.filter(c => c !== collaborator),
          last_modified: new Date(date)
        }
      })));
  }
}