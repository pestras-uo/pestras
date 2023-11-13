import { Injectable } from "@angular/core";
import { EntityTypes, Orgunit, OrgunitsApi } from "@pestras/shared/data-model";
import { OrgunitsService } from "./orgunits.service";
import { SessionEnd, SessionStart } from "../session/session.events";
import { Observable, filter, tap } from "rxjs";
import { StatorChannel, StatorCollectionState } from "@pestras/frontend/util/stator";
import { SSEActivity } from "../sse/sse.events";

@Injectable({ providedIn: 'root' })
export class OrgunitsState extends StatorCollectionState<Orgunit> {

  constructor(
    private service: OrgunitsService,
    private channel: StatorChannel
  ) {
    super('orgunits', 'serial', ['1h'], true);

    this.initListeners()
  }

  private initListeners() {
    // when session starts fetch all orgunits
    this.channel.select(SessionStart)
      .pipe(tap(() => this._init()))
      .subscribe(() => this._setLoading(false));

    // when session ends clear state
    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());

    // sse events
    this.channel.select(SSEActivity)
      .pipe(filter(act => act.entity === EntityTypes.ORGUNIT))
      .subscribe(act => {
        // new orgunit
        if (act.method === 'create')
          this.service.getBySerial({ serial: act.serial })
            .subscribe(org => org && this._insert(org));

        // orgunit updated
        else if (act.method === 'update')
          this._update(act.serial, { ...act.payload, last_modified: new Date() });
      });
  }

  protected override _load(): Observable<Orgunit[]> {
    return this.service.getAll();
  }

  create(data: OrgunitsApi.Create.Body) {
    return this.service.create(data)
      .pipe(tap(res => this._insert(res)));
  }

  update(params: OrgunitsApi.Update.Params, data: OrgunitsApi.Update.Body) {
    return this.service.update(params, data)
      .pipe(tap(res => this._update(params.serial, {
        ...data,
        last_modified: new Date(res)
      })));
  }

  updateLogo(params: OrgunitsApi.UpdateLogo.Params, data: OrgunitsApi.UpdateLogo.Body) {
    return this.service.updateLogo(params, data)
      .pipe(tap(res => this._update(params.serial, { logo: res.path })));
  }

  removeLogo(params: OrgunitsApi.RemoveLogo.Params) {
    return this.service.removeLogo(params)
      .pipe(tap(() => this._update(params.serial, { logo: '' })));
  }

  updateRegions(serial: string, regions: string[]) {
    return this.service.updateRegions({ serial }, { regions })
      .pipe(tap(res => this._update(serial, {
        regions: regions,
        last_modified: new Date(res)
      })));
  }
}