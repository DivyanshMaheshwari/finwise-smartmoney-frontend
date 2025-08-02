import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<string>();
  toast$ = this.toastSubject.asObservable();

  show(message: string) {
    console.log('ToastService: showing toast →', message); // ✅ Debug log
    this.toastSubject.next(message);
  }
}
