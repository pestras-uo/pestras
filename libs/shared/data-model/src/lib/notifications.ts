/* eslint-disable @typescript-eslint/no-explicit-any */
import { Activity } from "./activity";

export interface Notification<Payload extends (Record<string, any> | null) = null> extends Activity<Payload> {
  target: string;
  seen_date: Date | null;
}