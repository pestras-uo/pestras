export interface Comment {
  serial: string;
  record: string; // serial

  issuer: string; // serial
  text: string;

  create_date: Date;
  last_modified: Date;
}