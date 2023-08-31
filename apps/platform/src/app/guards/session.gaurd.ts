import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionState } from '@pestras/frontend/state';
import { map } from 'rxjs';

export const sessionGuard = (page: string) => {
  const guard: CanActivateFn = () => {
    const router = inject(Router);
    const session = inject(SessionState);

    return session.isLoggedIn$
      .pipe(map(isLoggedIn => {
        if (page === 'signin') {

          if (isLoggedIn) {
            router.navigate(["main", "workspace"])
            return false;
          }

        } else {
          if (!isLoggedIn) {
            router.navigate(["signin"])
            return false;
          }
        }

        return true;
      }));
  }

  return guard;
}