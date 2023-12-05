import { Component } from '@angular/core';
import { ToastsService } from '../toasts.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss']
})
export class ToastsComponent {

  toasts: Toast[] = [];

  constructor(
    private toastService: ToastsService,
  ) {
    this.toastService.toasts.subscribe((toast) => this.toasts.push(toast));
  }

  removeAt(i: number) {
    this.toasts.splice(i, 1);
  }

}

export type Toast = {
  autohide?: boolean,
  cssClasses?: string[] | { [key: string]: string } | string,
  delay?: number,
  message: string
};