import { WorkflowTriggers } from "./blueprint";

/* eslint-disable @typescript-eslint/no-explicit-any */
const notificationTypes = ["publish", "approve", "reject", "comment"] as const;

export type NotificationType = typeof notificationTypes[number];

export interface Notification {
  serial: string;
  type: NotificationType
  seen: Date | null;
  target: string;
  date: Date;
  issuer: string;
}

export interface PublishNotification extends Notification {
  type: 'publish',
  record: string;
  trigger: WorkflowTriggers,
  data_store: string;
  topic: string | null;
}

export interface ApproveNotification extends Notification {
  type: 'approve',
  record: string;
  trigger: WorkflowTriggers,
  data_store: string;
  topic: string | null;
}

export interface RejectNotification extends Notification {
  type: 'reject',
  record: string;
  trigger: WorkflowTriggers,
  data_store: string;
  topic: string | null;
}