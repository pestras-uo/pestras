export interface WebServiceLog {
  serial: string;
  service: string;
  msg: string;
  date: Date;
  type: 'error' | 'info';
  sub_logs: { msg: string; date: Date }[];
}