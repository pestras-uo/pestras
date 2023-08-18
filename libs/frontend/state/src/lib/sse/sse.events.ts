/* eslint-disable @typescript-eslint/no-explicit-any */
import { Activity } from "@pestras/shared/data-model";
import { StatorEvent } from "@pestras/frontend/util/stator";

export class SSEActivity extends StatorEvent<Activity<any>> {
  static override readonly meta = '[SSE] Activity Event';

  constructor(payload: Activity<any>) {
    super(payload);
  }
}