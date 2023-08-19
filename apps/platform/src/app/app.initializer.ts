import { SessionState } from "@pestras/frontend/state";

export function initApp(session: SessionState) {
  return () => {
    return session.verifySession();
  }
}