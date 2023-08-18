import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionState } from './session.state';

export const sessionGuard = (page: string) => {
  const router = inject(Router);
  const store = inject(SessionState);

  if (page === 'signin') {
    if (store.isLoggedIn) {
      router.navigate(["main", "workspace"])
      return false;
    }

  } else {
    if (!store.isLoggedIn) {
      router.navigate(["signin"])
      return false;
    }
  }

  return true;
}