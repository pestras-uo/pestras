import { Injectable } from '@angular/core';
import { EntityTypes, Role, User } from '@pestras/shared/data-model';
import { SessionStart, SessionEnd, SessionChange } from './session.events';
import { SessionService } from './session.service';
import { tap, filter, map } from 'rxjs';
import { StatorChannel, StatorObjectState } from '@pestras/frontend/util/stator';
import { SessionApi, AccountApi } from './session.api';
import { SSEActivity } from '../sse/sse.events';
import { Serial } from '@pestras/shared/util';

const _roles = ['admin', 'data_engineer', 'reporter', 'author', 'guest'];

@Injectable({ providedIn: 'root' })
export class SessionState extends StatorObjectState<User> {
  private storageKey = "nv29vh23vn2vh230bh2380";
  private _token: string | null = null;
  private _sseToken: string | null = null;

  constructor(
    private service: SessionService,
    private channel: StatorChannel
  ) {
    super('session', null, true);

    this.initListeners();
  }

  private initListeners() {
    // sse events
    this.channel.select(SSEActivity)
      .pipe(filter(act => act.entity === EntityTypes.USER && act.serial === this.get('serial')))
      .subscribe(act => {
        // roles updated
        if (act.method === 'updateRoles') {
          if (act.payload.roles)
            this._set('roles', act.payload.roles);
          if (act.payload.is_super)
            this._set('is_super', act.payload.is_super);
        }
      });
  }

  isLoggedIn() {
    return !!this.get();
  }

  isLoggedIn$() {
    return this.loading$.pipe(
      filter(loading => !loading),
      map(() => !!this.get())
    );
  }

  getToken() {
    return this._token;
  }

  getSSEToken() {
    return this._sseToken;
  }

  verifySession() {
    this._token = localStorage.getItem(this.storageKey) ?? null;
    
    return this.service.verifySession()
      .pipe(tap(res => {
        this._token = res?.token ?? null;
        this._sseToken = res?.sseToken ?? null;

        if (this._token)
          localStorage.setItem(this.storageKey, this._token);
        else {
          this._token = this._sseToken = null;
          localStorage.removeItem(this.storageKey);
        }

        if (res?.user) {
          this._set(res.user);
          this.channel.dispatch(new SessionStart(res.user));
        }

        this._setLoading(false);
      }));
  }

  login(data: SessionApi.Login.Body) {
    return this.service.login(data)
      .pipe(tap(res => {
        this._token = res?.token ?? null;
        this._sseToken = res?.sseToken ?? null;


        if (this._token)
          localStorage.setItem(this.storageKey, this._token);

        if (res?.user) {
          this._set(res.user);
          
          this.channel.dispatch(new SessionStart(res.user));
          

        }
      }));
  }

  logout() {
    return this.service.logout()
      .pipe(
        tap(() => this._token = this._sseToken = null),
        tap(() => localStorage.removeItem(this.storageKey)),
        tap(() => this._clear()),
        tap(() => this.channel.dispatch(new SessionEnd()))
      );
  }

  updateUsername(data: AccountApi.UpdateUsername.Body) {
    return this.service.updateUsername(data)
      .pipe(
        tap(() => this._set({ username: data.username, last_modified: new Date() })),
        tap(() => {
          const session = this.get();
          session
            ? this.channel.dispatch(new SessionChange(session))
            : this.channel.dispatch(new SessionEnd());
        })
      );
  }

  updatePassword(data: AccountApi.UpdatePassword.Body) {
    return this.service.updatePassword(data);
  }

  updateProfile(data: AccountApi.UpdateProfile.Body) {
    return this.service.updateProfile(data)
      .pipe(
        tap(() => this._set(data)),
        tap(() => {
          const session = this.get();
          session
            ? this.channel.dispatch(new SessionChange(session))
            : this.channel.dispatch(new SessionEnd());
        })
      );
  }

  updateAvater(data: AccountApi.UpdateAvatar.Body) {
    return this.service.updateAvatar(data).pipe(
      tap(res => this._set({
        avatar: res.path,
        last_modified: new Date()
      })),
      tap(() => {
        const session = this.get();
        session
          ? this.channel.dispatch(new SessionChange(session))
          : this.channel.dispatch(new SessionEnd());
      })
    );
  }

  deleteAvatar() {
    return this.service.deleteAvatar().pipe(
      tap(() => this._set({
        avatar: null,
        last_modified: new Date()
      })),
      tap(() => {
        const session = this.get();
        session
          ? this.channel.dispatch(new SessionChange(session))
          : this.channel.dispatch(new SessionEnd());
      })
    );
  }

  // util
  // --------------------------------------------------------------------
  isAdminOverUser(user: User) {
    const session = this.get();

    // session must be admin
    if (!session || !session.roles.includes(Role.ADMIN))
      return false;

    // session orgunit must be same or higher of user orgunit
    if (!Serial.isBranch(user.orgunit, session.orgunit, true))
      return false;

    // when orgunit is same, user should not be admin or session is super
    if (session.orgunit === user.orgunit && user.roles.includes(Role.ADMIN) && !session.is_super)
      return false;

    return true;
  }

  getTopRole(roles: Role[]) {
    return Math.min(...roles.map(r => _roles.indexOf(r)));
  }

}


