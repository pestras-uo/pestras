export enum UserMessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
  LOCATION = 'location'
}

export interface Message {
  /** inbox serial _ message serial */
  serial: string;

  type: UserMessageType;
  content: string;
  
  /** User serial */
  owner: string;

  create_date: Date;
  delete_date: Date | null;
}

export interface MessagingInbox {
  serial: string;

  admin: string;
  
  /** users serials */
  parties: string[];

  /** users serials */
  notify: string[];
  
  create_date: Date;
}