import { Injectable } from '@angular/core';
import { Subject, filter } from 'rxjs';

@Injectable()
export class PubSubService {

  private readonly subject = new Subject<string>();

  public pub(name: string) {
    this.subject.next(name);
  }
  public sub(name: string) {
    return this.subject.pipe(filter(n => n === name));
  }
}
