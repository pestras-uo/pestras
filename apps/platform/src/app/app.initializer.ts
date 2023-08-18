import { SessionState } from "@pestras/state";

export function initApp(session: SessionState) {
  return () => {
    return session.verifySession();
  }
}