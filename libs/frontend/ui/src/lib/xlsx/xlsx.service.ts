/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

const XLSX_EXT = 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class PuiXlsxService {

  export(data: any, filename: string) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    console.log(XLSX.writeFile(wb, `${filename}.${XLSX_EXT}`));
  }
}
