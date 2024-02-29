import { Injectable } from "@angular/core";
import { Workspace } from "@pestras/shared/data-model";
import { StatorChannel, StatorObjectState } from "@pestras/frontend/util/stator";
import { WorkspaceService } from "./workspace.service";
import { SessionEnd, SessionStart } from "../session/session.events";
import { switchMap, tap } from 'rxjs';
import { WorkspaceApi } from "./workspace.api";


@Injectable({ providedIn: 'root' })
export class WorkspaceState extends StatorObjectState<Workspace> {

  constructor(
    private service: WorkspaceService,
    private channel: StatorChannel
  ) {
    super('workspace', null, true);

    this.channel.select(SessionStart)
      .pipe(switchMap(() => this.init()))
      .subscribe(() => this._setLoading(false));

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());
  }

  private init() {
    return this.service.getByOwner()
      .pipe(tap(w => {
        this._set(w);
      }));
  }

  addGroup(name: string) {
    return this.service.addGroup({ name })
      .pipe(tap(serial => this._set('groups', state => state.groups.concat({ serial, name }), 'replace')));
  }

  updateGroup(group: string, name: string) {
    return this.service.updateGroup({ group }, { name })
      .pipe(tap(() => this._set('groups', state => state.groups.map(g => g.serial === group ? { ...g, name } : g), 'replace')));
  }

  removeGroup(group: string) {
    return this.service.removeGroup({ group })
      .pipe(tap(() => this._set('groups', state => state.groups.filter(g => g.serial !== group), 'replace')));
  }

  addPin(pin: WorkspaceApi.AddPin.Body) {
    return this.service.addPin(pin)
      .pipe(tap(() => this._set('pins', state => state.pins.concat(pin), 'replace')));
  }

  removePin(pin: string) {
    return this.service.removePin({ pin })
      .pipe(tap(() => this._set('pins', state => state.pins.filter(p => p.serial !== pin), 'replace')));
  }

  addSlide(slide: WorkspaceApi.AddSlide.Body) {
    return this.service.addSlide(slide)
      .pipe(tap(() => this._set('slides', state => state.slides.concat(slide), 'replace')));
  }

  removeSlide(slide: string) {
    return this.service.removeSlide({ slide })
      .pipe(tap(() => this._set('slides', state => state.slides.filter(p => p.slide !== slide), 'replace')));
  }
}