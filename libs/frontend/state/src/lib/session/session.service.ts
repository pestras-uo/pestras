import { Injectable } from "@angular/core";
import { injectURLPayload } from "@pestras/shared/util";
import { SessionApi, AccountApi } from "./session.api";
import { HttpClient } from '@angular/common/http';
import { catchError, of } from "rxjs";
import { EnvService } from "@pestras/frontend/env";

@Injectable({ providedIn: 'root' })
export class SessionService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) { }

  // Session Api
  // -------------------------------------------------------------------------------
  login(cred: SessionApi.Login.Body) {
    const path = injectURLPayload(this.envServ.env.api + SessionApi.Login.path);

    return this.http.post<SessionApi.Login.Response>(path, cred)
  }

  verifySession() {
    const path = injectURLPayload(this.envServ.env.api + SessionApi.Verify.path);

    return this.http.get<SessionApi.Verify.Response>(path)
      .pipe(catchError((err) => {
        console.error(err);
        return of(null)
      }));
  }

  logout() {
    const path = injectURLPayload(this.envServ.env.api + SessionApi.Logout.path);

    return this.http.delete(path)
  }

  // Account Api
  // -------------------------------------------------------------------------------
  updateUsername(data: AccountApi.UpdateUsername.Body) {
    const path = injectURLPayload(this.envServ.env.api + AccountApi.UpdateUsername.path);

    return this.http.put<AccountApi.UpdateUsername.Response>(path, data);
  }

  updatePassword(data: AccountApi.UpdatePassword.Body) {
    const path = injectURLPayload(this.envServ.env.api + AccountApi.UpdatePassword.path);

    return this.http.put<AccountApi.UpdatePassword.Response>(path, data);
  }

  updateProfile(data: AccountApi.UpdateProfile.Body) {
    const path = injectURLPayload(this.envServ.env.api + AccountApi.UpdateProfile.path);

    return this.http.put<AccountApi.UpdateProfile.Response>(path, data);
  }

  updateAvatar(data: AccountApi.UpdateAvatar.Body) {
    const path = injectURLPayload(this.envServ.env.api + AccountApi.UpdateAvatar.path);

    const form = new FormData();
    form.append('avatar', data.avatar);

    return this.http.put<AccountApi.UpdateAvatar.Response>(path, form);
  }

  deleteAvatar() {
    const path = injectURLPayload(this.envServ.env.api + AccountApi.DeleteAvatar.path);

    return this.http.delete<AccountApi.DeleteAvatar.Response>(path);
  }
}