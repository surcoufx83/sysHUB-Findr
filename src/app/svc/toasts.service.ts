import { Injectable } from '@angular/core';
import { Toast } from './toasts/toasts.component';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  private toasts$ = new Subject<Toast>();
  public toasts = this.toasts$.asObservable();

  constructor() { }

  addToast(toast: Toast) {
    toast.cssClasses = toast.cssClasses || 'shadow-sm';
    this.toasts$.next(toast);
  }

  addSuccessToast(toast: Toast) {
    toast.cssClasses = 'bg-success text-light shadow-sm';
    this.toasts$.next(toast);
  }

  addDangerToast(toast: Toast) {
    toast.cssClasses = 'bg-danger border border-danger text-light shadow-sm';
    toast.delay = toast.delay || 15000;
    this.toasts$.next(toast);
  }

}
