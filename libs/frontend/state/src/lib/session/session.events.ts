import { User } from "@pestras/shared/data-model";
import { StatorEvent } from "@pestras/frontend/util/stator";

// Session Events
// --------------------------------------------------------------------------
export class SessionStart extends StatorEvent<User> {
  static override readonly meta = '[Session State] Session Start';
  
  constructor(payload: User) {
    super(payload);
  }
}

export class SessionEnd extends StatorEvent {
  static override readonly meta = '[Session State] Session End';
}

export class SessionChange extends StatorEvent<User> {
  static override readonly meta = '[Session State] Session Change';

  constructor(payload: User) {
    super(payload)
  }
}