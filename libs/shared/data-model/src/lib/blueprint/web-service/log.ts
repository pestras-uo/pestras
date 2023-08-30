export interface WebServiceErrorLog {
  service: string;
  date : Date;
  error : string;
}

export interface WebServiceLog {
  serial: string;
  service: string;
  msg: string;
  date : Date;
  sub_logs: { msg: string; date: Date }[];
}