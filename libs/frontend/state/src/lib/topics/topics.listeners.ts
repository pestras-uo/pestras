/* eslint-disable @typescript-eslint/no-explicit-any */
import { Activity, EntityTypes } from "@pestras/shared/data-model";
import { SSEActivity } from "../sse/sse.events";
import { SessionEnd } from "../session/session.events";
import { TopicsState } from "./topics.state";
import { filter } from "rxjs";

export function topicsListeners(this: TopicsState) {

  this.channel.select(SessionEnd)
    .subscribe(() => this._clear());

  // sse events
  this.channel.select(SSEActivity)
    .pipe(filter(act => act.entity === EntityTypes.TOPIC))
    .subscribe(act => sseHandlers[act.method].call(this, act));
}

const sseHandlers: Record<string, (this: TopicsState, act: Activity<any>) => void> = {

  // Create
  // ---------------------------------------------------------------------------------------------------
  // new topic
  create(this: TopicsState, act: Activity<any>) {
    this.service.getBySerial({ serial: act.serial })
      .subscribe(t => !!t && this._insert(t));
  },

  // Update
  // ---------------------------------------------------------------------------------------------------
  // new topic
  update(this: TopicsState, act: Activity<any>) {
    this._update(act.serial, act.payload);
  },

  // Access
  // ---------------------------------------------------------------------------------------------------
  // orgunit added
  addAccessOrgunit(this: TopicsState, act: Activity<any>) {
    this._update(act.serial, t => {
      return { ...t, access: { ...t.access, orgunits: [...t.access.orgunits, act.payload['orgunit']] } };
    });
  },
  // orgunit removed
  removeAccessOrgunit(this: TopicsState, act: Activity<any>) {
    this._update(act.serial, t => {
      return { ...t, access: { ...t.access, orgunits: t.access.orgunits.filter(o => o !== act.payload['orgunit']) } };
    });
  },
  // user added
  addAccessUser(this: TopicsState, act: Activity<any>) {
    this._update(act.serial, t => {
      return { ...t, access: { ...t.access, users: [...t.access.users, act.payload['user']] } };
    });
  },
  // user removed
  removeAccessUser(this: TopicsState, act: Activity<any>) {
    this._update(act.serial, t => {
      return { ...t, access: { ...t.access, users: t.access.users.filter(o => o !== act.payload['user']) } };
    });
  },
  // group added
  addAccessGroup(this: TopicsState, act: Activity<any>) {
    this._update(act.serial, t => {
      return { ...t, access: { ...t.access, groups: [...t.access.groups, act.payload['group']] } };
    });
  },
  // group removed
  removeAccessGroup(this: TopicsState, act: Activity<any>) {
    this._update(act.serial, t => {
      return { ...t, access: { ...t.access, groups: t.access.groups.filter(o => o !== act.payload['group']) } };
    });
  },
}